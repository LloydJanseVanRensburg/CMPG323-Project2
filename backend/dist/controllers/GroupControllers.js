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
var ImageProcessing_1 = require("../services/ImageProcessing");
var GroupControllers = /** @class */ (function () {
    function GroupControllers() {
    }
    GroupControllers.getAll = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var query, _a, page, limit, pageNumber, limitNumber, groups, formattedGroups, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        query = new node_1.default.Query(node_1.default.Object.extend('Groups'));
                        _a = req.query, page = _a.page, limit = _a.limit;
                        pageNumber = Number(page) || 1;
                        limitNumber = Number(limit) || 15;
                        // Pagination Logic
                        query.skip((pageNumber - 1) * limitNumber);
                        query.limit(limitNumber);
                        return [4 /*yield*/, query.find()];
                    case 1:
                        groups = _b.sent();
                        formattedGroups = groups.map(function (group) {
                            return {
                                id: group.id,
                                title: group.get('title'),
                                description: group.get('description'),
                                groupPicture: group.get('imageKey'),
                                owner: group.get('owner').id,
                            };
                        });
                        // Respond to client with all groups info
                        res.status(200).json({
                            sucess: true,
                            count: formattedGroups.length,
                            page: pageNumber,
                            data: formattedGroups,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        // handle error
                        next(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GroupControllers.create = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, title, description, file, optimizedImgBuffer, result, imageKey, query, user, groupData, group, newGroup, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
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
                        return [4 /*yield*/, ImageProcessing_1.ImageProcessing.optimize(file.path)];
                    case 1:
                        optimizedImgBuffer = _b.sent();
                        return [4 /*yield*/, FileUploadMiddleware_1.uploadFile(optimizedImgBuffer, file.filename)];
                    case 2:
                        result = _b.sent();
                        imageKey = result.Key;
                        // Delete the image file from API server once sent to S3
                        return [4 /*yield*/, __1.unlinkFile(file.path)];
                    case 3:
                        // Delete the image file from API server once sent to S3
                        _b.sent();
                        query = new node_1.default.Query(node_1.default.User);
                        query.equalTo('objectId', userId);
                        return [4 /*yield*/, query.first()];
                    case 4:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, next(new BaseException_1.BaseException('User not found', 404))];
                        }
                        groupData = {
                            title: title,
                            description: description,
                            imageKey: imageKey,
                            owner: user,
                            memberCount: 0,
                        };
                        group = new node_1.default.Object('Groups');
                        group.set(groupData);
                        return [4 /*yield*/, group.save()];
                    case 5:
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
                                memberCount: newGroup.get('memberCount'),
                                ownerId: userId,
                            },
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _b.sent();
                        // handle error
                        next(error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    GroupControllers.getById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var groupId, query, foundGroup, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        groupId = req.params.groupId;
                        query = new node_1.default.Query(node_1.default.Object.extend('Groups'));
                        query.equalTo('objectId', groupId);
                        return [4 /*yield*/, query.first()];
                    case 1:
                        foundGroup = _a.sent();
                        if (!foundGroup) {
                            return [2 /*return*/, next(new BaseException_1.BaseException("Group with objectId: " + groupId + " not found", 404))];
                        }
                        // Respond back with group info to client
                        res.status(200).json({
                            success: true,
                            data: {
                                id: foundGroup.id,
                                title: foundGroup.get('title'),
                                description: foundGroup.get('description'),
                                groupPicture: foundGroup.get('imageKey'),
                                ownerId: foundGroup.get('owner').id,
                            },
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        // handle error
                        next(error_3);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GroupControllers.updateById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var groupId, queryGroup, foundGroup, userId, ownerId, _a, title, description, file, imageKey, optimizedImgBuffer, result, groupData, updatedGroup, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        groupId = req.params.groupId;
                        queryGroup = new node_1.default.Query(node_1.default.Object.extend('Groups'));
                        queryGroup.equalTo('objectId', groupId);
                        return [4 /*yield*/, queryGroup.first()];
                    case 1:
                        foundGroup = _b.sent();
                        // Check if group found
                        if (!foundGroup) {
                            return [2 /*return*/, next(new BaseException_1.BaseException("Group with objectId: " + groupId + " was not found", 404))];
                        }
                        userId = req.headers['userId'];
                        ownerId = foundGroup.get('owner').id;
                        if (userId !== ownerId) {
                            return [2 /*return*/, next(new BaseException_1.BaseException('You are not authorizated to do this', 401))];
                        }
                        _a = req.body, title = _a.title, description = _a.description;
                        file = req.file;
                        imageKey = null;
                        if (!file) return [3 /*break*/, 5];
                        return [4 /*yield*/, ImageProcessing_1.ImageProcessing.optimize(file.path)];
                    case 2:
                        optimizedImgBuffer = _b.sent();
                        return [4 /*yield*/, FileUploadMiddleware_1.uploadFile(optimizedImgBuffer, file.filename)];
                    case 3:
                        result = _b.sent();
                        imageKey = result.Key;
                        // Delete the image file from API server once sent to S3
                        return [4 /*yield*/, __1.unlinkFile(file.path)];
                    case 4:
                        // Delete the image file from API server once sent to S3
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        groupData = {};
                        if (title)
                            groupData.title = title;
                        if (description)
                            groupData.description = description;
                        if (imageKey) {
                            // TODO:
                            // Handle any file delete  of the group profile picture if image changed
                            groupData.imageKey = imageKey;
                        }
                        // Creating Group
                        foundGroup.set(groupData);
                        return [4 /*yield*/, foundGroup.save()];
                    case 6:
                        updatedGroup = _b.sent();
                        // Respond with created group info
                        res.status(201).json({
                            success: true,
                            data: {
                                id: updatedGroup.id,
                                title: updatedGroup.get('title'),
                                description: updatedGroup.get('description'),
                                groupPicture: updatedGroup.get('imageKey'),
                                memberCount: updatedGroup.get('memberCount'),
                                ownerId: updatedGroup.get('owner').id,
                            },
                        });
                        return [3 /*break*/, 8];
                    case 7:
                        error_4 = _b.sent();
                        // handle error
                        next(error_4);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    GroupControllers.deleteById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var groupId, groupQuery, foundGroup, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        groupId = req.params.groupId;
                        groupQuery = new node_1.default.Query(node_1.default.Object.extend('Groups'));
                        groupQuery.equalTo('objectId', groupId);
                        return [4 /*yield*/, groupQuery.first()];
                    case 1:
                        foundGroup = _a.sent();
                        if (!foundGroup) {
                            return [2 /*return*/, next(new BaseException_1.BaseException("Group with objectId " + groupId + " was not found", 404))];
                        }
                        // Destroy group
                        return [4 /*yield*/, foundGroup.destroy()];
                    case 2:
                        // Destroy group
                        _a.sent();
                        // TODO:
                        // Handle any file delete  of the group profile picture
                        // Respond back to client delete success
                        res.status(200).json({
                            success: true,
                            message: 'Group deleted',
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        // handle error
                        next(error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
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
                    // check if this user received invite
                    // then add this user to the group member table
                    // respond to client with a redirect to the group page that was joined
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
