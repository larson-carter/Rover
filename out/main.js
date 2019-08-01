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
const config_1 = __importDefault(require("./config/config"));
const express_1 = __importDefault(require("express"));
const pino_1 = __importDefault(require("pino"));
const cli_1 = __importDefault(require("./cli"));
const argv = process.argv;
const hasArgument = (arg) => {
    let result = argv.find((e) => e == '--no-cli');
    if (result != undefined && result.length > 0)
        return true;
};
const enableCLI = !hasArgument('--no-cli');
const app = express_1.default();
const logger = pino_1.default({
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
app.listen(config_1.default.server.port, () => __awaiter(this, void 0, void 0, function* () {
    if (enableCLI)
        yield cli_1.default.welcome();
    logger.info(`Web endpoints listening on 0.0.0.0:${config_1.default.server.port}...`);
    if (enableCLI)
        yield cli_1.default.initialize();
}));
