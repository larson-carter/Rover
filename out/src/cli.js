"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const center = (text) => require('center-align')(text, process.stdout.columns);
const chalk_1 = __importDefault(require("chalk"));
const cliffy_1 = require("cliffy");
const figlet_1 = __importDefault(require("figlet"));
class CLI {
    static welcome() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("");
            console.log("");
            console.log(chalk_1.default.red(center(figlet_1.default.textSync('Rover', {
                font: 'Basic'
            }))));
            console.log(center("Scraper and Crawler Software"));
            console.log(center("- by ApolloTV -"));
            console.log("");
            console.log("");
        });
    }
    static initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("");
            console.log(`${this.CLI_NAME} ${this.CLI_VERSION}`);
            const cliffy = new cliffy_1.CLI()
                .setName(this.CLI_NAME)
                .setVersion(this.CLI_VERSION)
                .setInfo("Interactive shell environment for ApolloTV Rover Scraper and Crawler Software")
                .setDelimiter("$ ")
                .addCommand('clear', {
                description: "Clears the console.",
                action: (params, options) => {
                    console.clear();
                }
            })
                .addCommand('close-cli', {
                description: "Closes the Rover CLI. Useful for debugging or process managers.",
                action: (params, options) => {
                    cliffy.hide();
                }
            })
                .addCommand('stop', {
                description: "Stops Rover from accepting any new connections and terminates the process.",
                action: (params, options) => {
                    console.log(chalk_1.default.red("Goodbye!"));
                    process.exit(0);
                }
            })
                .show();
        });
    }
}
CLI.CLI_NAME = "Rover CLI";
CLI.CLI_VERSION = "v1.0.0";
exports.default = CLI;
