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
exports.GroupControllers = void 0;
var node_1 = __importDefault(require("parse/node"));
var functions_1 = require("../utils/functions");
var BaseException_1 = require("../modules/BaseException");
var FileUploadMiddleware_1 = require("../middleware/FileUploadMiddleware");
var __1 = require("..");
var GroupControllers = /** @class */ (function () {
    function GroupControllers() {
    }
    GroupControllers.getAll = function (req, res, next) {
        try {
            // Parse Query All Groups
            // Respond to client with all groups info
        }
        catch (error) {
            // handle error
        }
    };
    GroupControllers.create = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, title, description, file, result, imageKey, query, user, groupData, group, newGroup, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        userId = req.headers['userId'];
                        // Validate Body data
                        if (!functions_1.validateCreateGroupBody(req.body)) {
                            return [2 /*return*/, next(new BaseException_1.BaseException('Please  provide all fields', 400))];
                        }
                        _a = req.body, title = _a.title, description = _a.description;
                        file = req.file;
                        // Upload File to S3 Bucket
                        if (!file) {
                            return [2 /*return*/, next(new BaseException_1.BaseException('Not group picture provided please provide image', 400))];
                        }
                        return [4 /*yield*/, FileUploadMiddleware_1.uploadFile(file)];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, __1.unlinkFile(file.path)];
                    case 2:
                        _b.sent();
                        imageKey = result.Key;
                        query = new node_1.default.Query(node_1.default.User);
                        query.equalTo('objectId', userId);
                        return [4 /*yield*/, query.first()];
                    case 3:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, next(new BaseException_1.BaseException('User not found', 404))];
                        }
                        groupData = {
                            title: title,
                            description: description,
                            imageKey: imageKey,
                            owner: user,
                        };
                        group = new node_1.default.Object('Groups');
                        group.set(groupData);
                        return [4 /*yield*/, group.save()];
                    case 4:
                        newGroup = _b.sent();
                        // TODO:
                        // Check if inviteEmailList is added then invites and add users
                        //SendInviteService(inviteEmailList)
                        // Respond with created group info
                        res.status(201).json({
                            success: true,
                            data: {
                                id: newGroup.id,
                                title: newGroup.get('title'),
                                description: newGroup.get('description'),
                                groupPicture: newGroup.get('imageKey'),
                                ownerId: userId,
                            },
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _b.sent();
                        // handle error
                        next(error_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GroupControllers.getById = function (req, res, next) {
        try {
            // Get groupId from params
            // Parse Query for group with objectId
            // Respond back with group info to client
        }
        catch (error) {
            // handle error
        }
    };
    GroupControllers.updateById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // Get groupId from params
                    // Handle any fileupload on this route for group picture updates
                    // Get body data for update
                    // Parse Query for group by objectId
                    // Update the data  found in body
                    // Save back group
                    // Respond to client with new group info
                }
                catch (error) {
                    // handle error
                }
                return [2 /*return*/];
            });
        });
    };
    GroupControllers.deleteById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // Get groupId from params
                    // Parse Query group by objectId
                    // Destroy group
                    // Handle any file delete  of the group profile picture
                    // Respond back to client delete success
                }
                catch (error) {
                    // handle error
                }
                return [2 /*return*/];
            });
        });
    };
    GroupControllers.inviteToGroup = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // Get list of emails to invite from req.body
                    // Check if these emails are actuall users of the app
                    // Check that they are not part of group already
                    // Send out emails to email list
                }
                catch (error) {
                    // handle error
                }
                return [2 /*return*/];
            });
        });
    };
    GroupControllers.joinGroup = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    //
                }
                catch (error) {
                    // handle error
                }
                return [2 /*return*/];
            });
        });
    };
    GroupControllers.leaveGroup = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // Get groupId and userId
                    // Parse Query the group members table by userId and groupId
                    // Detroy the link between user and group
                    // Respond to the client group left success
                }
                catch (error) {
                    // handle error
                }
                return [2 /*return*/];
            });
        });
    };
    return GroupControllers;
}());
exports.GroupControllers = GroupControllers;
