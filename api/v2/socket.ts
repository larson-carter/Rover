import config from '../../config/config';

import {Server} from "http";
import * as WebSocket from 'ws';
import {ApolloWebSocket} from "../../vendor";
import * as AuthMiddleware from '../../src/middleware/auth';
import Application, {Utility} from "../../src/application";
import P = require("pino");

export default function(server: Server){

    Application.set('activeConnections', 0);

    const SocketServer = new WebSocket.Server({
        server,
        verifyClient: AuthMiddleware.socketConnection
    });

    // Handle connection event
    SocketServer.on('connection', (socket: ApolloWebSocket) => {

        Application.update('activeConnections', (value: number) => ++value);
        socket.isAlive = true;
        socket.on('pong', () => {
            socket.isAlive = true;
        });

        socket.on('message', (message: string) => {

        });

        socket.on('close', () => {
            Application.update('activeConnections', (value: number) => --value);
        });

    });

    setInterval(() => {

        SocketServer.clients.forEach((client) => {

            const socket = client as ApolloWebSocket;

            if(!socket.isAlive) socket.terminate();

            socket.isAlive = false;
            socket.ping(null, undefined);

        });

    }, 30000);

    Application.getUtility<P.Logger>(Utility.Logger).info(`${Application.isCliEnabled() ? "🔌 " : ""}Socket API is active.`);

}