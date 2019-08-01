const center = (text: String) => require('center-align')(text, process.stdout.columns);
import chalk from 'chalk';
import { CLI as Cliffy } from 'cliffy';
import figlet from 'figlet';

export default class CLI {

    static readonly CLI_NAME = "Rover CLI";
    static readonly CLI_VERSION = "v1.0.0";

    static async welcome() {
        console.log("");
        console.log("");

        console.log(chalk.red(center(figlet.textSync('Rover', {
            font: 'Basic'
        }))));
        console.log(center("Scraper and Crawler Software"));
        console.log(center("- by ApolloTV -"));

        console.log("");
        console.log("");
    }

    static async initialize(){
        console.log("");
        console.log(`${this.CLI_NAME} ${this.CLI_VERSION}`);

        const cliffy = new Cliffy()
            .setName(this.CLI_NAME)
            .setVersion(this.CLI_VERSION)
            .setInfo("Interactive shell environment for ApolloTV Rover Scraper and Crawler Software")
            .setDelimiter("$ ")
            .addCommand('close-cli', {
                description: "Closes the Rover CLI. Useful for debugging or process managers.",
                action: (params, options) => {
                    cliffy.hide();
                }
            })
            .addCommand('stop', {
                description: "Stops Rover from accepting any new connections and terminates the process.",
                action: (params, options) => {
                    console.log(chalk.red("Goodbye!"));
                    process.exit(0);
                }
            })
            .show();
    }

}