import config from '../config/config';
import api_v2 from '../api/v2';
import socket_api_v2 from '../api/v2/socket';
import cli from './cli';
import Application, {Utility} from './application';

import express from 'express';
import pino from 'pino';
import responseTime from 'response-time';
import * as http from "http";

const pkg = require('../package.json');

(async function(){

    if(Application.isCliEnabled()) await cli.welcome();
    const enableRequestLogging = Application.hasArgument('--enable-logging');

    const app = express();
    app.set('x-powered-by', false);

    const logger = pino({
        name: 'Rover',
        level: 'debug',
        prettyPrint: Application.isCliEnabled() ? {
            levelFirst: true,
            ignore: 'hostname,time',
            translateTime: "SYS:m/dd/yyyy HH:mm:ss"
        } : false
    });
    Application.setUtility(Utility.Logger, logger);

    // Express: log to console.
    if(enableRequestLogging) app.use(require('express-pino-logger')({
        logger: logger
    }));
    // Express: add response time in handling a request to outgoing headers.
    app.use(responseTime());
    // Express: output branding headers
    app.use((req, res, next) => {
        res.set('X-Rover-Version', pkg.version);
        next();
    });

    app.all('/', (req, res) => {
        res.redirect(config.application.defaultRedirect);
    });

    /* BEGIN: REGISTERING APIs */

    // Register API v2
    const server = http.createServer(app);
    socket_api_v2(server);
    app.use('/api/v2', api_v2());

    /* END: REGISTERING APIs */

    const invalidAPI = (req: any, res: any) => {
        res.status(404).json({
            success: false,
            error: "ERR_INVALID_API_VERSION",
            message: "You have provided a missing or invalid API endpoint. Try /api/v2/"
        });
    };
    app.all('/api', invalidAPI);
    app.all('/api/*', invalidAPI);

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: "ERR_NOT_FOUND",
            message: "Unable to locate the resource that was requested."
        });
    });

    server.listen(config.server.port || 3000, async () => {
        let enableCli : boolean = Application.isCliEnabled();
        logger.info(`${enableCli ? "🌐 " : ""}Web endpoints listening on 0.0.0.0:${config.server.port}...`);
        if(enableCli) await cli.initialize();
    });

})();