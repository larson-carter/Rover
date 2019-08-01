import config from './config/config';
import express from 'express';
import pino from 'pino';
import cli from './cli';

const argv = process.argv;
const hasArgument = (arg : String) => {
    let result = argv.find((e : String) => e == '--no-cli');
    if(result != undefined && result.length > 0) return true;
}
const enableCLI = !hasArgument('--no-cli');

const app = express();
const logger = pino({
    name: 'Rover',
    level: 'debug',
    prettyPrint: enableCLI ? {
        levelFirst: true,
        ignore: 'hostname,time',
        translateTime: "SYS:m/dd/yyyy HH:mm:ss"
    } : false
});

app.use(require('express-pino-logger')({
    logger: logger
}));


app.get('/', (req, res) => {
    res.redirect("https://apollotv.xyz/");
});

app.listen(config.server.port, async () => {
    if(enableCLI) await cli.welcome();
    logger.info(`Web endpoints listening on 0.0.0.0:${config.server.port}...`);
    if(enableCLI) await cli.initialize();
});