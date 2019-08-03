export enum Utility {
    Logger
}

export default class Application {

    private properties: Map<string, any>;
    private utilities: Map<Utility, any>;

    private static instance: Application;
    private constructor(){
        this.properties = new Map<string, any>();
        this.utilities = new Map<Utility, any>();
        Application.instance = this;
    }

    public static getInstance(): Application {
        if(this.instance == null) this.instance = new Application();
        return this.instance;
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

    public static isCliEnabled() : boolean {
        return !this.hasArgument("--no-cli");
    }

}