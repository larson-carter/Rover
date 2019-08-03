import { promisify } from 'util';
import * as ChildProcess from 'child_process';
import Mocha from 'mocha';

process.env.TS_NODE_PROJECT = "../tsconfig.json";
process.env.TS_CONFIG_PATHS = "true";

const mocha = new Mocha();

describe('Rover', () => {
    it('should compile', () => {
        return new Promise((resolve, reject) => {
            ChildProcess.exec("npm run prepare", (error, stdout, stderr) => {
                if(!error) return resolve();
                // For some reason, stderr is entirely useless in terms of printing the errors,
                // so stdout is being used instead.
                reject(stdout);
            });
        });
    });
});