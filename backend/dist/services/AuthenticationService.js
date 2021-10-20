"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
var node_1 = __importDefault(require("parse/node"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var BaseException_1 = require("../modules/BaseException");
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService() {
    }
    AuthenticationService.login = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var result, sessionToken, payload, token, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, node_1.default.User.logIn(data.email, data.password)];
                    case 1:
                        result = _a.sent();
                        sessionToken = result.getSessionToken();
                        payload = {
                            userId: result.id,
                            sessionToken: sessionToken,
                        };
                        token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                            expiresIn: '1d',
                        });
                        resolve({
                            success: true,
                            data: {
                                token: token,
                                user: {
                                    id: result.get('objectId'),
                                    username: result.get('username'),
                                    email: result.get('email'),
                                    profilePrictureUrl: result.get('profilePrictureUrl'),
                                },
                            },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1.message);
                        if (error_1.message === 'jwt expires') {
                            reject(new BaseException_1.BaseException('Token has expired', 401));
                        }
                        else if (error_1.message === 'Invalid username/password.') {
                            console.log('fired');
                            reject(new BaseException_1.BaseException('Invalid email or password', 400));
                        }
                        else {
                            reject(error_1);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    AuthenticationService.register = function (data) {
        var _this = this;
        var user = new node_1.default.User();
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var result, payload, token, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        user.set(data);
                        return [4 /*yield*/, user.signUp()];
                    case 1:
                        result = _a.sent();
                        payload = {
                            userId: result.id,
                            sessionToken: result.getSessionToken(),
                        };
                        token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
                            expiresIn: '1d',
                        });
                        resolve({
                            success: true,
                            data: {
                                token: token,
                                user: {
                                    id: result.get('objectId'),
                                    username: result.get('username'),
                                    email: result.get('email'),
                                    profilePrictureUrl: result.get('profilePrictureUrl'),
                                },
                            },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        reject(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
