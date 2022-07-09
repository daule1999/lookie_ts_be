"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config/config");
let dir = config_1.logDirectory;
if (!dir)
    dir = path_1.default.resolve('logs');
// create directory if it is not present
if (!fs_1.default.existsSync(dir)) {
    // Create the directory if it does not exist
    fs_1.default.mkdirSync(dir);
}
const logLevel = config_1.environment === 'development' ? 'debug' : 'warn';
const options = {
    file: {
        level: logLevel,
        filename: dir + '/%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        timestamp: true,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        prettyPrint: true,
        json: true,
        maxSize: '20m',
        colorize: true,
        maxFiles: '14d',
    },
};
exports.default = (0, winston_1.createLogger)({
    transports: [
        new winston_1.transports.Console({
        // level: logLevel,
        // format: format.combine(format.errors({ stack: true }), format.prettyPrint()),
        }),
    ],
    format: winston_1.format.simple(),
    // exceptionHandlers: [new DailyRotateFile(options.file)],
    // exitOnError: false, // do not exit on handled exceptions
});
//# sourceMappingURL=Logger.js.map