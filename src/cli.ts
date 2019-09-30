import Application, {Utility} from "./application";
import chalk from 'chalk';
import {CLI as Cliffy} from 'cliffy';
import figlet from 'figlet';
import Ora from 'ora';
import packageMeta from '../package.json';
import P = require("pino");

const center = (text: String) => require('center-align')(text, process.stdout.columns);

const chalkTable = require('chalk-table');

export default class CLI {

    static readonly CLI_NAME = "Rover CLI";
    static readonly CLI_VERSION = "v" + packageMeta.version;

    static async welcome() {
        console.log("");
        console.log("");

        console.log(chalk.greenBright(center(figlet.textSync('Rover', {
            font: 'Basic'
        }))));
        console.log(center(packageMeta.description));
        console.log(center("- by ApolloTV -"));

        console.log("");
        console.log("");
    }

    /**
     * Performs an asynchronous action (promise), whilst displaying a message and progress indicator in the CLI.
     * If the CLI is turned off the message will simply be logged before and after the action using the application
     * logger.
     *
     * @param action The action you wish to perform whilst showing a progress indicator.
     * @param message The message that should display next to the progress indicator.
     */
    static async withProgressIndicator(action: (ora: Ora.Ora) => void, message: string = "Loading, please wait..."){
        const logger = Application.getUtility<P.Logger>(Utility.Logger);
        let progressIndicator : Ora.Ora;
        if(Application.isCliEnabled()){
            progressIndicator = Ora({
                spinner: 'bouncingBar',
                color: 'white'
            }).start(message);
        }

        let success : boolean = true;
        try {
            await action(progressIndicator);
        } catch(ex) {
            progressIndicator.stop();
            logger.error(ex.message);
            success = false;
        }

        if(Application.isCliEnabled()){
            progressIndicator.stop();
            if(success) return progressIndicator.succeed(message);
            progressIndicator.fail(message);
            return;
        }

        if(success) logger.info(`[COMPLETE] ${message}`);
        else logger.error(`[COMPLETE] ${message}`);
    }

    static async initialize(){
        console.log("");
        console.log(`${this.CLI_NAME} ${this.CLI_VERSION}`);

        const cliffy = new Cliffy()
            .setName(this.CLI_NAME)
            .setVersion(this.CLI_VERSION)
            .setInfo("Interactive shell environment for ApolloTV Rover Scraper and Crawler Software")
            .setDelimiter("$ ")
            .addCommand('stats', {
                description: "Shows statistics about Rover, such as number of connected clients.",
                action: (params, options) => {
                    console.log("");
                    console.log(chalkTable(
                        { leftPad: 2, columns: [
                            { field: "key", name: chalk.green.bold("Key") },
                            { field: "value", name: "Value" }
                        ] },
                        [
                            { key: chalk.greenBright.bold("Active Socket Connections: "), value: Application.get('activeConnections') }
                        ]
                    ));
                }
            })
            .addCommand('clear', {
                description: "Clears the console.",
                action: (params, options) => {
                    console.clear();
                }
            })
            .addCommand('close-cli', {
                description: "Closes the Rover CLI. Useful for debugging or process managers. (CAUTION: In some cases, this can make the console ignore all input.)",
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