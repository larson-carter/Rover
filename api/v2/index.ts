import { Router } from 'express';
import sntp from 'sntp';
const os = require('os-utils');

function success(data: any, message: String){
    if(data == null) data = {};
    delete data.success;
    delete data.message;

    if(message != null) data.message = message;

    return Object.assign({
        success: true
    }, data);
}

function fail(error: String, message: String){
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
        os.cpuUsage((usage: number) => {
            res.json(success({
                load: Number(usage * 100).toFixed(2)
            }, usage < 0.8
                ? "Rover appears to be functioning as intended."
                : "Rover is experiencing high CPU usage. Perhaps there is high load on this machine, or a problem with Rover."
            ));
        });
    });


    return router;

}