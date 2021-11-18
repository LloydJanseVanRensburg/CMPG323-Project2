import { Request, Response, NextFunction } from 'express';
import { validateCreateGroupBody } from '../utils/requestValidations';
import { BaseException } from '../modules/BaseException';
import { Op } from 'sequelize';
import { httpStatusCode } from '../constants/httpStatusCodes';
import { ROLE } from '../constants/groupMemberRoles';
import { InviteService } from '../services/InviteService';
import { ImageProcessing } from '../services/ImageProcessing';
import { uploadFile } from '../middleware/FileUploadMiddleware';
import { unlinkFile } from '../utils/deleteFiles';

const db = require('../models');

export class GroupControllers {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await db.group.findAll();

      // Respond to client with all groups info
      res.status(httpStatusCode.OK).json({
        sucess: true,
        data: groups,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate Body data
      if (!validateCreateGroupBody(req.body)) {
        return next(BaseException.invalidRequestBody());
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
        role: ROLE.SUPERADMIN,
      });

      // TODO: Check if inviteEmailList is added then invites and add users

      // Respond with created group info
      res.status(httpStatusCode.CREATED).json({
        success: true,
        data: newGroup,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      // Get groupId from params
      let { groupId } = req.params;

      // Parse Query for group with objectId
      const group = await db.group.findByPk(groupId);

      if (!group) {
        next(BaseException.notFound());
        return;
      }

      // Respond back with group info to client
      res.status(httpStatusCode.OK).json({
        success: true,
        data: group,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const { id: userId } = req.user;
      const { groupId } = req.params;

      const foundGroup = await db.group.findByPk(groupId);

      // Check if group found
      if (!foundGroup) {
        next(BaseException.notFound());
        return;
      }

      // Super Admin and Admin can update group
      // Check that user trying to update group has  one  of these roles
      const isGroupAdmin = await db.groupmember.findOne({
        where: {
          memberId: userId,
          groupId: groupId,
          role: {
            [Op.or]: [ROLE.SUPERADMIN, ROLE.ADMIN],
          },
        },
      });

      if (!isGroupAdmin) {
        next(BaseException.notAllowed());
        return;
      }

      // Get Body Data and File
      const { title, description } = req.body;

      if (title) foundGroup.title = title;
      if (description) foundGroup.description = description;

      const updatedGroup = await foundGroup.save();

      // Respond with created group info
      res.status(httpStatusCode.CREATED).json({
        success: true,
        data: updatedGroup,
      });
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      // Get groupId from params
      let { groupId } = req.params;
      // @ts-ignore
      const { id: userId } = req.user;

      const group = await db.group.findByPk(groupId);

      if (!group) {
        return next(BaseException.notFound());
      }

      // Super Admin can delete group
      // Check that user trying to delete group has super admin role
      const isGroupAdmin = await db.groupmember.findOne({
        where: {
          memberId: userId,
          groupId: groupId,
          role: {
            [Op.or]: [ROLE.SUPERADMIN],
          },
        },
      });

      if (!isGroupAdmin) {
        next(BaseException.notAllowed());
        return;
      }

      await group.destroy();

      // Respond back to client delete success
      res.status(httpStatusCode.OK).json({
        success: true,
        message: 'Group deleted',
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async inviteToGroup(req: Request, res: Response, next: NextFunction) {
    try {
      // Get list of emails to invite from req.body
      let { emailInviteList } = req.body;
      let { groupId } = req.params;

      const foundGroup = await db.group.findByPk(groupId);

      if (!foundGroup) {
        next(BaseException.notFound());
        return;
      }

      await InviteService.sendInvites(emailInviteList, foundGroup);

      res.status(httpStatusCode.OK).json({
        success: true,
        message: 'Invites sent',
      });
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static async joinGroup(req: Request, res: Response, next: NextFunction) {
    try {
      // check if this user received invite
      let { email, token } = req.query;
      let { groupId } = req.params;

      const foundGroup = await db.group.findByPk(groupId);

      if (!foundGroup) {
        next(BaseException.notFound());
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
        next(BaseException.notInvited());
        return;
      }

      // Get user from email
      const foundUser = await db.user.findOne({ where: { email: email } });

      if (!foundUser) {
        next(BaseException.notFound());
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

      res.status(httpStatusCode.CREATED).json({
        success: true,
        message: 'Joined group',
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async leaveGroup(req: Request, res: Response, next: NextFunction) {
    try {
      // Get groupId and userId
      let { groupId } = req.params;
      // @ts-ignore
      const { id: userId } = req.user;

      const foundGroup = await db.group.findByPk(groupId);

      if (!foundGroup) {
        next(BaseException.notFound());
        return;
      }

      const foundGroupMember = await db.groupmember.findOne({
        where: {
          memberId: userId,
          groupId,
        },
      });

      if (!foundGroupMember) {
        next(BaseException.notFound());
        return;
      }

      // Destroy the link between user and group
      await foundGroupMember.destroy();

      // Subtract 1 from memberCount of group
      await foundGroup.decrement('memberCount', { by: 1 });

      // Respond to the client group left success
      res.status(httpStatusCode.OK).json({
        success: true,
        message: 'Left group',
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async uploadProfile(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.file);

      if (!req.file) {
        next(BaseException.notFileFound());
        return;
      }

      const optimizedImageBuffer = await ImageProcessing.optimize(
        req.file.path
      );

      const uploadResult = await uploadFile(
        optimizedImageBuffer,
        req.file.originalname
      );

      await unlinkFile(req.file.path);

      res.status(httpStatusCode.CREATED).json({
        success: true,
        data: {
          imageKey: uploadResult.Key,
        },
        message: 'Group profile uploaded',
      });
    } catch (error: any) {
      next(error);
    }
  }
}
