import express = require("express");
import * as http from "http";
import * as URL from "url";

/**
 * Express Middleware used to authenticate regular HTTP requests to Rover.
 *
 * @param req
 * @param res
 * @param next
 */
export async function httpConnection(req: express.Request, res: express.Response, next: express.NextFunction){

    res.status(500).json({
        success: false,
        error: "ERR_NOT_IMPLEMENTED",
        message: "The authentication route is being used, however authentication has not yet been set up.",
    });
    //next();

}

export async function socketConnection(info: { origin: string; secure: boolean; req: http.IncomingMessage }) : Promise<boolean> {

    const token = URL.parse(info.req.url, true).query.token as string;
    return await validate(token);

}

async function validate(token: string): Promise<boolean> {
    return true;
}