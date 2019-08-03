import * as WebSocket from 'ws';

interface ApolloWebSocket extends WebSocket {

    // Whether or not ping/pong is being sent over the socket connection.
    isAlive: boolean;

}