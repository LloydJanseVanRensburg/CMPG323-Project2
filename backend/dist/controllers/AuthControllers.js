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
exports.AuthControllers = void 0;
var BaseException_1 = require("../modules/BaseException");
var functions_1 = require("../utils/functions");
var AuthenticationService_1 = require("../services/AuthenticationService");
var node_1 = __importDefault(require("parse/node"));
var AuthControllers = /** @class */ (function () {
    function AuthControllers() {
    }
    AuthControllers.logout = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionToken, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionToken = req.headers['sessionToken'];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        node_1.default.User.enableUnsafeCurrentUser();
                        return [4 /*yield*/, node_1.default.User.become(sessionToken)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, node_1.default.User.logOut()];
                    case 3:
                        _a.sent();
                        res.status(200).json({
                            success: true,
                            message: 'Logged out',
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        next(error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthControllers.loggedInUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, query, user, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.headers['userId'];
                        query = new node_1.default.Query(node_1.default.User);
                        query.equalTo('objectId', userId);
                        return [4 /*yield*/, query.first({ useMasterKey: true })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, next(new BaseException_1.BaseException('User not found', 404))];
                        }
                        res.status(200).json({
                            success: true,
                            data: {
                                user: {
                                    id: user.id,
                                    username: user.get('username'),
                                    email: user.get('email'),
                                    profilePrictureUrl: user.get('profilePictureUrl'),
                                },
                            },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        next(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthControllers.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, data, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!functions_1.validateLoginAuthBody(req.body)) {
                            return [2 /*return*/, next(new BaseException_1.BaseException('Please provide all email and password', 400))];
                        }
                        _a = req.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, AuthenticationService_1.AuthenticationService.login({ email: email, password: password })];
                    case 1:
                        data = _b.sent();
                        res.status(200).json(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _b.sent();
                        next(new BaseException_1.BaseException(error_3.message, error_3.statusCode));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthControllers.register = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, username, password, profilePrictureUrl, registerData, data, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!functions_1.validateRegisterAuthBody(req.body)) {
                            return [2 /*return*/, next(new BaseException_1.BaseException('Please provide all email and password', 400))];
                        }
                        _a = req.body, email = _a.email, username = _a.username, password = _a.password, profilePrictureUrl = _a.profilePrictureUrl;
                        registerData = {
                            email: email,
                            username: email,
                            name: username,
                            password: password,
                            profilePrictureUrl: profilePrictureUrl !== null && profilePrictureUrl !== void 0 ? profilePrictureUrl : 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png',
                        };
                        return [4 /*yield*/, AuthenticationService_1.AuthenticationService.register(registerData)];
                    case 1:
                        data = _b.sent();
                        res.status(200).json(data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _b.sent();
                        next(new BaseException_1.BaseException(error_4.message, error_4.statusCode));
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthControllers;
}());
exports.AuthControllers = AuthControllers;
