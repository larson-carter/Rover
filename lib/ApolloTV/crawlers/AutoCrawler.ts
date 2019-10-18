import Module from "../../../src/struct/Module";
import {ChildProcess, spawn} from 'child_process';
import Application from "../../../src/application";

const AUTO_CRAWLER_PROC_DIR : string = "_AutoCrawler";

export default class AutoCrawler extends Module {

    private childProcess : ChildProcess;

    private constructor(){
        super({
            name: 'AutoCrawler',
            version: '0.0.1a',
            description: "A module that attempts to populate the Rover database by crawling website sitemaps and pages in a general manner."
        }, 'crawler');
    }

    initialize() : void {
        this.setStatus("Running");
        this.childProcess = spawn('ts-node', [`${__dirname}/${AUTO_CRAWLER_PROC_DIR}/index.ts`, `--db=${Application.getConfig().database.url}`], {
            stdio: [null, process.stdout, process.stderr]
        });

        this.childProcess.on('exit', () => {
            this.setStatus('Terminated');
        });
    }

    terminate() : void {

    }


}