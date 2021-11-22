"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const fs_1 = __importDefault(require("fs"));
class ErrorHandler {
    static isTrustedError(error) {
        if (error.isOperational) {
            return true;
        }
        else {
            return false;
        }
    }
    static fatale(err, res, next) {
        console.log('==============Handling fatale error===========');
        console.log(err);
        let error = `
    Server Error: ${Date.now()}
    error: ${err}
    message: ${err.message}
    stack trace: ${err.stack}
    `;
        fs_1.default.writeFile(`./logs/fatale-${Date.now()}.txt`, error, { flag: 'w+' }, function (err) {
            if (err)
                return console.log(err);
            console.log('Fatale Log File Created - Check ./logs dir');
        });
        res.status(500).json({
            msg: 'Server Error',
        });
    }
}
exports.ErrorHandler = ErrorHandler;
