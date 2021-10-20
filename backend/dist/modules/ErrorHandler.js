"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
var fs_1 = __importDefault(require("fs"));
var ErrorHandler = /** @class */ (function () {
    function ErrorHandler() {
    }
    ErrorHandler.isTrustedError = function (error) {
        if (error.isOperational) {
            return true;
        }
        else {
            return false;
        }
    };
    ErrorHandler.fatale = function (err, res, next) {
        console.log('==============Handling fatale error===========');
        console.log(err);
        var error = "\n    Server Error: " + Date.now() + "\n    error: " + err + "\n    message: " + err.message + "\n    stack trace: " + err.stack + "\n    ";
        fs_1.default.writeFile("./logs/fatale-" + Date.now() + ".txt", error, { flag: 'w+' }, function (err) {
            if (err)
                return console.log(err);
            console.log('Fatale Log File Created - Check ./logs dir');
        });
        res.status(500).json({
            msg: 'Server Error',
        });
    };
    return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;
