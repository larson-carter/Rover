"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Icons {
    constructor(enableCLI) {
        this.icons = {
            globe: "🌐"
        };
        this.enableCLI = enableCLI;
        Icons.instance = this;
    }
    static initialize(enableCLI) {
        new Icons(enableCLI);
    }
    static getIcons() {
        return Icons.instance.icons;
    }
    static get(name) {
        if (Icons.getIcons()[name] != undefined && Icons.instance.enableCLI)
            return Icons.getIcons()[name];
        return "";
    }
}
exports.default = Icons;
