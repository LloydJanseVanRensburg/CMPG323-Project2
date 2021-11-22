"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupControllers = void 0;
const requestValidations_1 = require("../utils/requestValidations");
const BaseException_1 = require("../modules/BaseException");
const sequelize_1 = require("sequelize");
const httpStatusCodes_1 = require("../constants/httpStatusCodes");
const groupMemberRoles_1 = require("../constants/groupMemberRoles");
const InviteService_1 = require("../services/InviteService");
const ImageProcessing_1 = require("../services/ImageProcessing");
const FileUploadMiddleware_1 = require("../middleware/FileUploadMiddleware");
const deleteFiles_1 = require("../utils/deleteFiles");
const db = require('../models');
class GroupControllers {
    static async getAll(req, res, next) {
        try {
            const groups = await db.group.findAll();
            // Respond to client with all groups info
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                sucess: true,
                data: groups,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async create(req, res, next) {
        try {
            // Validate Body data
            if (!(0, requestValidations_1.validateCreateGroupBody)(req.body)) {
                return next(BaseException_1.BaseException.invalidRequestBody());
            }
            // @ts-ignore
            const { id: userId } = req.user;
            // Get Body Data and File
            const { title, description, image } = req.body;
            // Creating Group
            const newGroup = await db.group.create({
                owner: userId,
                title,
                description,
                groupPicture: image || 'ea83409a099cfe26db0a435faf362b31',
                memberCount: 1,
            });
            // Add the creator of the group as groupmember super admin for group
            await db.groupmember.create({
                memberId: userId,
                groupId: newGroup.id,
                role: groupMemberRoles_1.ROLE.SUPERADMIN,
            });
            // TODO: Check if inviteEmailList is added then invites and add users
            // Respond with created group info
            res.status(httpStatusCodes_1.httpStatusCode.CREATED).json({
                success: true,
                data: newGroup,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            // Get groupId from params
            let { groupId } = req.params;
            // Parse Query for group with objectId
            const group = await db.group.findByPk(groupId);
            if (!group) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            // Respond back with group info to client
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                data: group,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateById(req, res, next) {
        try {
            // @ts-ignore
            const { id: userId } = req.user;
            const { groupId } = req.params;
            const foundGroup = await db.group.findByPk(groupId);
            // Check if group found
            if (!foundGroup) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            // Super Admin and Admin can update group
            // Check that user trying to update group has  one  of these roles
            const isGroupAdmin = await db.groupmember.findOne({
                where: {
                    memberId: userId,
                    groupId: groupId,
                    role: {
                        [sequelize_1.Op.or]: [groupMemberRoles_1.ROLE.SUPERADMIN, groupMemberRoles_1.ROLE.ADMIN],
                    },
                },
            });
            if (!isGroupAdmin) {
                next(BaseException_1.BaseException.notAllowed());
                return;
            }
            // Get Body Data and File
            const { title, description, image } = req.body;
            if (title)
                foundGroup.title = title;
            if (description)
                foundGroup.description = description;
            if (image)
                foundGroup.groupPicture = image;
            const updatedGroup = await foundGroup.save();
            // Respond with created group info
            res.status(httpStatusCodes_1.httpStatusCode.CREATED).json({
                success: true,
                data: updatedGroup,
            });
        }
        catch (error) {
            // handle error
            next(error);
        }
    }
    static async deleteById(req, res, next) {
        try {
            // Get groupId from params
            let { groupId } = req.params;
            // @ts-ignore
            const { id: userId } = req.user;
            const group = await db.group.findByPk(groupId);
            if (!group) {
                return next(BaseException_1.BaseException.notFound());
            }
            // Super Admin can delete group
            // Check that user trying to delete group has super admin role
            const isGroupAdmin = await db.groupmember.findOne({
                where: {
                    memberId: userId,
                    groupId: groupId,
                    role: {
                        [sequelize_1.Op.or]: [groupMemberRoles_1.ROLE.SUPERADMIN],
                    },
                },
            });
            if (!isGroupAdmin) {
                next(BaseException_1.BaseException.notAllowed());
                return;
            }
            await group.destroy();
            // Respond back to client delete success
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                message: 'Group deleted',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async inviteToGroup(req, res, next) {
        try {
            // Get list of emails to invite from req.body
            let { emailInviteList } = req.body;
            let { groupId } = req.params;
            const foundGroup = await db.group.findByPk(groupId);
            if (!foundGroup) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            await InviteService_1.InviteService.sendInvites(emailInviteList, foundGroup);
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                message: 'Invites sent',
            });
        }
        catch (error) {
            // handle error
            next(error);
        }
    }
    static async joinGroup(req, res, next) {
        try {
            // check if this user received invite
            let { email, token } = req.query;
            let { groupId } = req.params;
            const foundGroup = await db.group.findByPk(groupId);
            if (!foundGroup) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            // Get group invite based on info from request
            const foundGroupInvite = await db.groupinvite.findOne({
                where: {
                    email: email,
                    groupId: groupId,
                    token: token,
                },
            });
            if (!foundGroupInvite) {
                next(BaseException_1.BaseException.notInvited());
                return;
            }
            // Get user from email
            const foundUser = await db.user.findOne({ where: { email: email } });
            if (!foundUser) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            // Add this user as member of group to groupMembers class
            await db.groupmember.create({
                memberId: foundUser.id,
                groupId: groupId,
            });
            // Destroy Invite once user is joined
            await foundGroupInvite.destroy();
            // Update member count
            await foundGroup.increment('memberCount', { by: 1 });
            res.status(httpStatusCodes_1.httpStatusCode.CREATED).json({
                success: true,
                message: 'Joined group',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async leaveGroup(req, res, next) {
        try {
            // Get groupId and userId
            let { groupId } = req.params;
            // @ts-ignore
            const { id: userId } = req.user;
            const foundGroup = await db.group.findByPk(groupId);
            if (!foundGroup) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            const foundGroupMember = await db.groupmember.findOne({
                where: {
                    memberId: userId,
                    groupId,
                },
            });
            if (!foundGroupMember) {
                next(BaseException_1.BaseException.notFound());
                return;
            }
            // Destroy the link between user and group
            await foundGroupMember.destroy();
            // Subtract 1 from memberCount of group
            await foundGroup.decrement('memberCount', { by: 1 });
            // Respond to the client group left success
            res.status(httpStatusCodes_1.httpStatusCode.OK).json({
                success: true,
                message: 'Left group',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async uploadProfile(req, res, next) {
        try {
            console.log(req.file);
            if (!req.file) {
                next(BaseException_1.BaseException.notFileFound());
                return;
            }
            const optimizedImageBuffer = await ImageProcessing_1.ImageProcessing.optimize(req.file.path);
            const uploadResult = await (0, FileUploadMiddleware_1.uploadFile)(optimizedImageBuffer, req.file.originalname);
            await (0, deleteFiles_1.unlinkFile)(req.file.path);
            res.status(httpStatusCodes_1.httpStatusCode.CREATED).json({
                success: true,
                data: {
                    imageKey: uploadResult.Key,
                },
                message: 'Group profile uploaded',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.GroupControllers = GroupControllers;
