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
const config_1 = __importDefault(require("../config/config"));
const api_1 = __importDefault(require("../api"));
const cli_1 = __importDefault(require("./cli"));
const icons_1 = __importDefault(require("./utils/icons"));
const express_1 = __importDefault(require("express"));
const pino_1 = __importDefault(require("pino"));
const argv = process.argv;
const hasArgument = (arg) => {
    let result = argv.find((e) => e == '--no-cli');
    if (result != undefined && result.length > 0)
        return true;
};
const enableCLI = !hasArgument('--no-cli');
icons_1.default.initialize(enableCLI);
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
app.all('/', (req, res) => {
    res.redirect(config_1.default.application.defaultRedirect);
});
app.all('/api', (req, res) => {
    res.status(404).json({
        success: false,
        error: "ERR_INVALID_API_VERSION",
        message: "You have provided a missing or invalid API endpoint. Try /api/v2/"
    });
});
app.use('/api/v2', api_1.default());
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: "ERR_NOT_FOUND",
        message: "Unable to locate the resource that was requested."
    });
});
app.listen(config_1.default.server.port, () => __awaiter(this, void 0, void 0, function* () {
    if (enableCLI)
        yield cli_1.default.welcome();
    logger.info(`${icons_1.default.get('globe')}Web endpoints listening on 0.0.0.0:${config_1.default.server.port}...`);
    if (enableCLI)
        yield cli_1.default.initialize();
}));
