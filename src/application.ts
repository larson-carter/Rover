import {promises as fs, Stats} from "fs";
import Module, {ModuleAuthor, ModuleMetadata, ModuleType} from "./struct/Module";
import P = require("pino");
import RoverConfig from "./struct/Config";

export enum Utility {
    Logger
}

export default class Application {

    private config: RoverConfig;

    private modules: Array<Module>;
    private properties: Map<string, any>;
    private utilities: Map<Utility, any>;

    private static instance: Application;
    private constructor(){
        this.modules = [];
        this.properties = new Map<string, any>();
        this.utilities = new Map<Utility, any>();
        Application.instance = this;
    }

    public static getInstance(): Application {
        if(this.instance == null) this.instance = new Application();
        return this.instance;
    }

    public static configure(config: RoverConfig) : void {
        if(this.getInstance().config != null) throw new Error("Application is already configured. You cannot configure it again.");
        this.getInstance().config = config;
    }

    public static getConfig() : RoverConfig {
        return this.getInstance().config;
    }

    public static get<T>(name: string){
        return this.getInstance().properties.get(name) as T;
    }

    public static set(name: string, value: any){
        this.getInstance().properties.set(name, value);
    }

    public static update(name: string, updateFunction: Function){
        this.getInstance().properties.set(name, updateFunction(this.getInstance().properties.get(name)));
    }

    public static getUtility<T>(name: Utility){
        return Application.getInstance().utilities.get(name) as T;
    }

    public static setUtility(name: Utility, utility: any){
        Application.getInstance().utilities.set(name, utility);
    }

    public static getArguments() : Array<string>{
        return process.argv;
    }

    public static hasArgument(arg: string) : boolean {
        let result = this.getArguments().find((e : string) => e == arg);
        if(result != undefined && result.length > 0) return true;
    }

    /**
     * Determines whether the command line arguments have or have not been set (--no-cli, --no-repl),
     * such that the CLI should be enabled.
     */
    public static isCliEnabled() : boolean {
        return !this.hasArgument("--no-cli") && !this.hasArgument("--no-repl");
    }

    /**
     * Determines whether the command line arguments have or have not been set (--no-ext, --safe-mode),
     * such that all additional modules should be disabled.
     */
    public static isSafeMode() : boolean {
        return !this.hasArgument('--no-ext') && !this.hasArgument("--safe-mode");
    }

    /**
     * Unloads and clears any loaded modules (where appropriate) and recursively
     * loads all modules from the directory specified.
     *
     * @param moduleDir The directory to load modules from.
     * @param onLoadModule The function executed when a module is loaded.
     * @param author The author of the modules in this directory - or in a parent directory.
     */
    public static async loadModules(moduleDir: string, onLoadModule?: (meta: ModuleMetadata, module: Module) => void, author?: ModuleAuthor){
        const files = await fs.readdir(moduleDir);
        for(let file of files){
            if(file.startsWith("_")) continue;
            const target = await fs.realpath(`${moduleDir}/${file}`);
            const targetStats : Stats = await fs.stat(target);

            if(targetStats.isDirectory()) {
                // Determine the path where author data would potentially be stored,
                const authorDataPath : string = `${target}/author.json`;
                // Check it for author data,
                try {
                    if((await fs.stat(authorDataPath)).isFile()){
                        author = JSON.parse(await fs.readFile(authorDataPath, {
                            encoding: 'utf-8'
                        }));
                    }
                }catch(ignored){}
                // Then, let's scan the directory for modules.
                await this.loadModules(target, onLoadModule, author);
            }

            // If it's a TypeScript file, we need to try and load it to determine whether it's a module.
            if(targetStats.isFile() && target.endsWith('.ts')){
                const _import = (await import(target));
                if(!_import.default || typeof _import.default != 'function'){
                    this.getUtility<P.Logger>(Utility.Logger).info(`Ignoring ${target} as it does not export a default class.`);
                    continue;
                }

                const _importedClass = new (_import.default)();
                if(_importedClass instanceof Module){
                    if(_importedClass.getMeta() === undefined || _importedClass.getMeta() === null){
                        this.getUtility<P.Logger>(Utility.Logger).info(`Ignoring ${target} as it does not have valid module metadata.`);
                        continue;
                    }

                    _importedClass.setAuthor(author);
                    _importedClass.initialize();
                    this.getInstance().modules.push(_importedClass);
                    if(onLoadModule) await onLoadModule(_importedClass.getMeta(), _importedClass);
                }else{
                    this.getUtility<P.Logger>(Utility.Logger).info(`Ignoring ${target} as it is not a module.`);
                }
            }
        }
    }

    public static getAllModules(type: ModuleType = null) : Array<Module> {
        return this.getInstance().modules.filter((module) => {
            if(!type) return true;
            return module.getType() == type;
        });
    }

}