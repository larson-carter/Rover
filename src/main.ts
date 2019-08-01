import config from '../config/config';
import api_v2 from '../api/v2';
import cli from './cli';
import Icons from './utils/icons';

import express from 'express';
import pino from 'pino';
import responseTime from 'response-time';

const pkg = require('../package.json');
const argv = process.argv;
const hasArgument = (arg : String) => {
    let result = argv.find((e : String) => e == '--no-cli');
    if(result != undefined && result.length > 0) return true;
}
const enableCLI = !hasArgument('--no-cli');
Icons.initialize(enableCLI);

const app = express();
app.set('x-powered-by', false);

const logger = pino({
    name: 'Rover',
    level: 'debug',
    prettyPrint: enableCLI ? {
        levelFirst: true,
        ignore: 'hostname,time',
        translateTime: "SYS:m/dd/yyyy HH:mm:ss"
    } : false
});

// Express: log to console.
app.use(require('express-pino-logger')({
    logger: logger
}));
// Express: add response time in handling a request to outgoing headers.
app.use(responseTime());
// Express: output branding headers
app.use((req, res, next) => {
    res.set('X-Rover-Version', pkg.version)
    next();
});

app.all('/', (req, res) => {
    res.redirect(config.application.defaultRedirect);
});

app.use('/api/v2', api_v2());

const invalidAPI = (req: any, res: any) => {
    res.status(404).json({
        success: false,
        error: "ERR_INVALID_API_VERSION",
        message: "You have provided a missing or invalid API endpoint. Try /api/v2/"
    });
};
app.all('/api', invalidAPI);
app.all('/api/*', invalidAPI);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: "ERR_NOT_FOUND",
        message: "Unable to locate the resource that was requested."
    });
});

app.listen(config.server.port, async () => {
    if(enableCLI) await cli.welcome();
    logger.info(`${Icons.get('globe')}Web endpoints listening on 0.0.0.0:${config.server.port}...`);
    if(enableCLI) await cli.initialize();
});