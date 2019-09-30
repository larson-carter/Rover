import { Router } from 'express';
import sntp from 'sntp';
import Application from "../../src/application";
const OSUtils = require('os-utils');

function success(data: any, message: String) : object {
    if(data == null) data = {};
    delete data.success;
    delete data.message;

    if(message != null) data.message = message;

    return Object.assign({
        success: true
    }, data);
}

function fail(error: String, message: String) : object {
    return {
        success: false,
        error,
        message
    }
}

export default function() {

    // Initializes the router for the API endpoint.
    // By default, Rover's API is exposed at /api/v2/
    const router = Router();


    router.get('/', async (req, res) => {
        res.json(success(null, "Welcome to ApolloTV Rover"));
    });

    router.get('/time', async (req, res) => {
        await sntp.start();
        const now = Math.floor(sntp.now() / 1000);
        sntp.stop();

        res.json(success({
            now: now
        }, null));
    });

    router.get('/status', async (req, res) => {
        let cpuUsage = await new Promise<number>((resolve, reject) => {
            OSUtils.cpuUsage((value: number) => resolve(value));
        });

        let status = {
            modules: (() => {
                let modules : any = {};

                Application.getAllModules().forEach((module) => {
                    if(modules[module.getAuthor().name] == null) modules[module.getAuthor().name] = {
                        "_$": {
                            website: module.getAuthor().website,
                            count: 0
                        }
                    };
                    if(modules[module.getAuthor().name][module.getType()] == null) modules[module.getAuthor().name][module.getType()] = [];

                    modules[module.getAuthor().name]._$.count += 1;
                    modules[module.getAuthor().name][module.getType()].push({
                        name: module.getMeta().name,
                        version: module.getMeta().version,
                        description: module.getMeta().description,
                        status: module.getStatus()
                    });
                });

                return modules;
            })(),
            load: {
                cpu: parseFloat(Number(cpuUsage * 100).toFixed(2))
            },
            maxLoad: -1,
            activeConnections: Application.get('activeConnections')
        };

        // The maximum load of any of status.load - essentially the bottleneck.
        status.maxLoad = Object.values(status.load).reduce((total, currentElement) => {
            let current = currentElement;
            return current > total ? current : total;
        }, 0);

        let response = success(status, status.maxLoad < 80
            ? "Rover appears to be functioning as intended."
            : "Rover is experiencing high load. Perhaps there is high request volume on this machine, or a problem with Rover."
        );

        if(!!req.query['readable']){
            res.status(200)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send(JSON.stringify(response, null, 4));
            return;
        }

        res.json(response);
    });

    router.use((req, res, next) => {
        res.json(fail("ERR_INVALID_ACTION", "You have not provided a valid action to perform."));
    });

    return router;

}