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
var crypto_1 = __importDefault(require("crypto"));
var functions_1 = require("../utils/functions");
var BaseException_1 = require("../modules/BaseException");
var FileUploadMiddleware_1 = require("../middleware/FileUploadMiddleware");
var __1 = require("..");
var ImageProcessing_1 = require("../services/ImageProcessing");
var EmailingServices_1 = require("../services/EmailingServices");
var Group_1 = __importDefault(require("../models/Group"));
var User_1 = __importDefault(require("../models/User"));
var GroupInvite_1 = __importDefault(require("../models/GroupInvite"));
var GroupMember_1 = __importDefault(require("../models/GroupMember"));
var GroupControllers = /** @class */ (function () {
    function GroupControllers() {
    }
    GroupControllers.getAll = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, page, limit, pageNumber, limitNumber, groupsQuery, groups, formattedGroups, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = req.query, page = _a.page, limit = _a.limit;
                        pageNumber = Number(page) || 1;
                        limitNumber = Number(limit) || 15;
                        groupsQuery = Group_1.default.find();
                        groupsQuery.skip((pageNumber - 1) * limitNumber);
                        groupsQuery.limit(limitNumber);
                        return [4 /*yield*/, groupsQuery.find()];
                    case 1:
                        groups = _b.sent();
                        formattedGroups = groups.map(function (group) {
                            return {
                                id: group._id,
                                title: group.title,
                                description: group.description,
                                groupPicture: group.profilePicture,
                                owner: group.owner,
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
            var userId, _a, title, description, file, optimizedImgBuffer, result, imageKey, groupData, newGroup, error_2;
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
                        groupData = {
                            title: title,
                            description: description,
                            imageKey: imageKey,
                            owner: userId,
                            memberCount: 0,
                        };
                        newGroup = new Group_1.default(groupData);
                        return [4 /*yield*/, newGroup.save()];
                    case 4:
                        newGroup = _b.sent();
                        // TODO:
                        // Check if inviteEmailList is added then invites and add users
                        //SendInviteService(inviteEmailList)
                        // Respond with created group info
                        res.status(201).json({
                            success: true,
                            data: {
                                id: newGroup._id,
                                title: newGroup.title,
                                description: newGroup.description,
                                groupPicture: newGroup.profilePicture,
                                memberCount: newGroup.memberCount,
                                ownerId: userId,
                            },
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _b.sent();
                        // handle error
                        next(error_2);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GroupControllers.getById = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var groupId, group, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        groupId = req.params.groupId;
                        return [4 /*yield*/, Group_1.default.findById(groupId)];
                    case 1:
                        group = _a.sent();
                        if (!group) {
                            return [2 /*return*/, next(new BaseException_1.BaseException("Group with objectId: " + groupId + " not found", 404))];
                        }
                        // Respond back with group info to client
                        res.status(200).json({
                            success: true,
                            data: {
                                id: group._id,
                                title: group.title,
                                description: group.description,
                                groupPicture: group.groupPicture,
                                ownerId: group.owner,
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
            var groupId, foundGroup, userId, ownerId, _a, title, description, file, imageKey, optimizedImgBuffer, result, groupData, updatedGroup, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 7, , 8]);
                        groupId = req.params.groupId;
                        return [4 /*yield*/, Group_1.default.findById(groupId)];
                    case 1:
                        foundGroup = _b.sent();
                        // Check if group found
                        if (!foundGroup) {
                            return [2 /*return*/, next(new BaseException_1.BaseException("Group with objectId: " + groupId + " was not found", 404))];
                        }
                        userId = req.headers['userId'];
                        ownerId = foundGroup.owner;
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
                        return [4 /*yield*/, Group_1.default.findByIdAndUpdate(groupId, groupData, {
                                runValidators: true,
                                new: true,
                            })];
                    case 6:
                        updatedGroup = _b.sent();
                        // Respond with created group info
                        res.status(201).json({
                            success: true,
                            data: {
                                id: updatedGroup._id,
                                title: updatedGroup.title,
                                description: updatedGroup.description,
                                groupPicture: updatedGroup.groupPicture,
                                memberCount: updatedGroup.memberCount,
                                ownerId: updatedGroup.owner,
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
            var groupId, group, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        groupId = req.params.groupId;
                        return [4 /*yield*/, Group_1.default.findById(groupId)];
                    case 1:
                        group = _a.sent();
                        if (!group) {
                            return [2 /*return*/, next(new BaseException_1.BaseException("Group with objectId " + groupId + " was not found", 404))];
                        }
                        return [4 /*yield*/, Group_1.default.findByIdAndRemove(groupId)];
                    case 2:
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
            var emailInviteList, groupId, foundGroup_1, cleanEmailList, i, email, foundUser, isMember, foundGroupInvites, inviteObj, error_6;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        emailInviteList = req.body.emailInviteList;
                        groupId = req.params.groupId;
                        return [4 /*yield*/, Group_1.default.findById(groupId)];
                    case 1:
                        foundGroup_1 = _a.sent();
                        if (!foundGroup_1) {
                            return [2 /*return*/, next(new BaseException_1.BaseException("Group with objectId " + groupId + " was not found", 404))];
                        }
                        cleanEmailList = [];
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < emailInviteList.length)) return [3 /*break*/, 7];
                        email = emailInviteList[i];
                        return [4 /*yield*/, User_1.default.findOne({ email: email })];
                    case 3:
                        foundUser = _a.sent();
                        if (!foundUser) {
                            return [3 /*break*/, 6];
                        }
                        return [4 /*yield*/, GroupMember_1.default.findOne({
                                userId: foundUser._id,
                                groupId: foundGroup_1._id,
                            })];
                    case 4:
                        isMember = _a.sent();
                        if (isMember) {
                            return [3 /*break*/, 6];
                        }
                        return [4 /*yield*/, GroupInvite_1.default.find({
                                email: email,
                                groupId: groupId,
                            })];
                    case 5:
                        foundGroupInvites = _a.sent();
                        foundGroupInvites.forEach(function (invite) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, GroupInvite_1.default.findByIdAndRemove(invite._id)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        inviteObj = {
                            userId: foundUser._id,
                            groupId: foundGroup_1._id,
                            email: foundUser.email,
                        };
                        cleanEmailList.push(inviteObj);
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 2];
                    case 7:
                        cleanEmailList.forEach(function (invite) { return __awaiter(_this, void 0, void 0, function () {
                            var token, baseURL, customURL, joinLink, message, groupInvite;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        token = crypto_1.default.randomBytes(20).toString('hex');
                                        baseURL = process.env.FRONTEND_URL;
                                        customURL = "/groups/" + foundGroup_1.id + "/join?email=" + invite.email + "&token=" + token;
                                        joinLink = "" + baseURL + customURL;
                                        message = "\n          <h1>You have received an group invitation to " + foundGroup_1.get('title') + "</h1>\n          <p>Click on the link below to join</p>\n          <p>OR make PUT request to " + customURL + "</p>\n          <a href=\"" + joinLink + "\" clicktracking=off>Join Group</a>\n        ";
                                        groupInvite = new GroupInvite_1.default({
                                            email: invite.email,
                                            groupId: invite.groupId,
                                            token: token,
                                        });
                                        return [4 /*yield*/, groupInvite.save()];
                                    case 1:
                                        _a.sent();
                                        // Send Email
                                        EmailingServices_1.EmailServices.sendEmail({
                                            to: invite.email,
                                            subject: "Group Invite From " + foundGroup_1.title,
                                            text: message,
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        res.status(200).json({
                            success: true,
                            message: 'Invites sent',
                        });
                        return [3 /*break*/, 9];
                    case 8:
                        error_6 = _a.sent();
                        // handle error
                        next(error_6);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    GroupControllers.joinGroup = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, token, groupId, foundGroupInvite, foundUser, groupMember, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        _a = req.query, email = _a.email, token = _a.token;
                        groupId = req.params.groupId;
                        return [4 /*yield*/, GroupInvite_1.default.findOne({
                                email: email,
                                groupId: groupId,
                                token: token,
                            })];
                    case 1:
                        foundGroupInvite = _b.sent();
                        if (!foundGroupInvite) {
                            return [2 /*return*/, next(new BaseException_1.BaseException('You where not invited, sorry!', 404))];
                        }
                        return [4 /*yield*/, User_1.default.findOne({ email: email })];
                    case 2:
                        foundUser = _b.sent();
                        if (!foundUser) {
                            return [2 /*return*/, next(new BaseException_1.BaseException("No user with email " + email + " was found", 404))];
                        }
                        groupMember = new GroupMember_1.default({
                            userId: foundUser._id,
                            groupId: groupId,
                        });
                        return [4 /*yield*/, groupMember.save()];
                    case 3:
                        _b.sent();
                        // Destroy Invite once user is joined
                        return [4 /*yield*/, GroupInvite_1.default.findByIdAndRemove(foundGroupInvite._id)];
                    case 4:
                        // Destroy Invite once user is joined
                        _b.sent();
                        res.status(201).json({
                            success: true,
                            message: 'Joined group',
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        error_7 = _b.sent();
                        // handle error
                        next(error_7);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GroupControllers.leaveGroup = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var groupId, userId, foundGroupMember, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        groupId = req.params.groupId;
                        userId = req.headers['userId'];
                        return [4 /*yield*/, GroupMember_1.default.findOne({
                                userId: userId,
                                groupId: groupId,
                            })];
                    case 1:
                        foundGroupMember = _a.sent();
                        if (!foundGroupMember) {
                            return [2 /*return*/, next(new BaseException_1.BaseException("User " + userId + " was never joined to group " + groupId, 400))];
                        }
                        // Detroy the link between user and group
                        return [4 /*yield*/, GroupMember_1.default.findByIdAndRemove(foundGroupMember._id)];
                    case 2:
                        // Detroy the link between user and group
                        _a.sent();
                        // Respond to the client group left success
                        res.status(201).json({
                            success: true,
                            message: 'Left group',
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_8 = _a.sent();
                        // handle error
                        next(error_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return GroupControllers;
}());
exports.GroupControllers = GroupControllers;
