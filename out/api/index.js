"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sntp_1 = __importDefault(require("sntp"));
const os = require('os-utils');
function success(data, message) {
    if (data == null)
        data = {};
    delete data.success;
    delete data.message;
    if (message != null)
        data.message = message;
    return Object.assign({
        success: true
    }, data);
}
function fail(error, message) {
    return {
        success: false,
        error,
        message
    };
}
function default_1() {
    // Initializes the router for the API endpoint.
    // By default, Rover's API is exposed at /api/v2/
    const router = express_1.Router();
    router.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.json(success(null, "Welcome to ApolloTV Rover"));
    }));
    router.get('/time', (req, res) => __awaiter(this, void 0, void 0, function* () {
        yield sntp_1.default.start();
        const now = Math.floor(sntp_1.default.now() / 1000);
        sntp_1.default.stop();
        res.json(success({
            now: now
        }, null));
    }));
    router.get('/status', (req, res) => __awaiter(this, void 0, void 0, function* () {
        os.cpuUsage((usage) => {
            res.json(success({
                load: Number(usage * 100).toFixed(2)
            }, usage < 0.8
                ? "Rover appears to be functioning as intended."
                : "Rover is experiencing high CPU usage. Perhaps there is high load on this machine, or a problem with Rover."));
        });
    }));
    return router;
}
exports.default = default_1;
