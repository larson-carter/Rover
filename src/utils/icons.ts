export default class Icons {

    private static instance: Icons;
    private icons: any;
    private enableCLI: any;

    private constructor(enableCLI: boolean){
        this.icons = {
            globe: "🌐"
        };
        this.enableCLI = enableCLI;

        Icons.instance = this;
    }

    public static initialize(enableCLI: boolean){
        new Icons(enableCLI);
    }

    private static getIcons(): any {
        return Icons.instance.icons;
    }

    static get(name: string){
        if(Icons.getIcons()[name] != undefined && Icons.instance.enableCLI) return Icons.getIcons()[name];
        return "";
    }

}