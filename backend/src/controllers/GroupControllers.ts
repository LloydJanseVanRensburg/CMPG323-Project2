import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { validateCreateGroupBody } from '../utils/requestValidations';
import { BaseException } from '../modules/BaseException';
import { uploadFile } from '../middleware/FileUploadMiddleware';
import { unlinkFile } from '../utils/deleteFiles';
import { ImageProcessing } from '../services/ImageProcessing';
import { EmailServices } from '../services/EmailingServices';
import { httpStatusCode } from '../constants/httpStatusCodes';

const db = require('../models');

export class GroupControllers {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const groups = await db.group.findAll({
        attributes: {
          include: ['id', 'title', 'description', 'groupPicture', 'owner'],
        },
      });

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
      const { title, description } = req.body;
      let file = req.file;

      // Upload File to S3 Bucket
      if (!file) {
        next(BaseException.invalidRequestBody());
        return;
      }

      // Optimize the image file
      const optimizedImgBuffer = await ImageProcessing.optimize(file.path);

      const result = await uploadFile(optimizedImgBuffer, file.filename);
      let imageKey = result.Key;

      // Delete the image file from API server once sent to S3
      await unlinkFile(file.path);

      // Data that builds up group
      let groupData = {
        owner: userId,
        title,
        description,
        groupPicture: imageKey,
        memberCount: 0,
      };

      // Creating Group
      let newGroup = await db.group.create(groupData);

      // TODO:
      // Check if inviteEmailList is added then invites and add users
      //SendInviteService(inviteEmailList)

      // Respond with created group info
      res.status(httpStatusCode.CREATED).json({
        success: true,
        data: {
          id: newGroup._id,
          title: newGroup.title,
          description: newGroup.description,
          groupPicture: newGroup.groupPicture,
          memberCount: newGroup.memberCount,
          ownerId: userId,
        },
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
      const group = await db.group.findByPk(groupId, {
        attributes: {
          include: ['id', 'title', 'description', 'groupPicture', 'owner'],
        },
      });

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

      let ownerId = foundGroup.owner;

      if (userId !== ownerId) {
        next(BaseException.notAllowed());
        return;
      }

      // Get Body Data and File
      const { title, description } = req.body;
      let file = req.file;
      let imageKey = null;

      if (file) {
        // Optimize the image file
        const optimizedImgBuffer = await ImageProcessing.optimize(file.path);

        // Upload File to S3 Bucket
        const result = await uploadFile(optimizedImgBuffer, file.filename);
        imageKey = result.Key;

        // Delete the image file from API server once sent to S3
        await unlinkFile(file.path);
      }

      if (title) foundGroup.title = title;
      if (description) foundGroup.description = description;
      if (imageKey) {
        foundGroup.imageKey = imageKey;
      }

      const updatedGroup = await foundGroup.save();

      // Respond with created group info
      res.status(httpStatusCode.CREATED).json({
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
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      // Get groupId from params
      let { groupId } = req.params;

      const group = await db.group.findByPk(groupId);

      if (!group) {
        return next(BaseException.notFound());
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
        return next(
          new BaseException(`Group with objectId ${groupId} was not found`, 404)
        );
      }

      const cleanEmailList = [];

      for (let i = 0; i < emailInviteList.length; i++) {
        // Check that user is registered
        let email = emailInviteList[i];

        const foundUser = await db.user.findOne({ where: { email: email } });

        if (!foundUser) {
          continue;
        }

        // Check that user is not part of group already
        const isMember = await db.groupmember.findOne({
          where: {
            userId: foundUser._id,
            groupId: foundGroup._id,
          },
        });

        if (isMember) {
          continue;
        }

        // Remove and invites that is already in group invites for this user and group combo
        const foundGroupInvite = await db.groupinvite.findOne({
          email: email,
          groupId: groupId,
        });

        await foundGroupInvite.destory();

        let inviteObj = {
          userId: foundUser._id,
          groupId: foundGroup._id,
          email: foundUser.email,
        };

        cleanEmailList.push(inviteObj);
      }

      cleanEmailList.forEach(async (invite) => {
        // Generate Custom Join URL and Message example <domain>/api/v1/groups/:groupId/join?email=&groupId=&token=
        let token = crypto.randomBytes(20).toString('hex');
        let baseURL = process.env.FRONTEND_URL;
        let customURL = `/groups/${foundGroup.id}/join?email=${invite.email}&token=${token}`;
        let joinLink = `${baseURL}${customURL}`;

        // Generate Custom HTML email template
        let message = `
          <h1>You have received an group invitation to ${foundGroup.get(
            'title'
          )}</h1>
          <p>Click on the link below to join</p>
          <p>OR make PUT request to ${customURL}</p>
          <a href="${joinLink}" clicktracking=off>Join Group</a>
        `;

        // Add to groupInvite class
        await db.groupinvite.create({
          email: invite.email,
          groupId: invite.groupId,
          token: token,
        });

        // Send Email
        EmailServices.sendEmail({
          to: invite.email,
          subject: `Group Invite From ${foundGroup.title}`,
          text: message,
        });
      });

      res.status(200).json({
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

      // Get group invite based on info from request
      const foundGroupInvite = await db.groupinvite.findOne({
        where: {
          email: email,
          groupId: groupId,
          token: token,
        },
      });

      if (!foundGroupInvite) {
        return next(new BaseException('You where not invited, sorry!', 404));
      }

      // Get user from email
      const foundUser = await db.user.findOne({ where: { email: email } });

      if (!foundUser) {
        return next(
          new BaseException(`No user with email ${email} was found`, 404)
        );
      }

      // Add this user as member of group to groupMembers class
      await db.groupmember.create({
        userId: foundUser._id,
        groupId: groupId,
      });

      // Destroy Invite once user is joined
      await foundGroupInvite.destroy();

      res.status(201).json({
        success: true,
        message: 'Joined group',
      });
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static async leaveGroup(req: Request, res: Response, next: NextFunction) {
    try {
      // Get groupId and userId
      let { groupId } = req.params;
      let userId = req.headers['userId'];

      const foundGroupMember = await db.groupmember.findOne({
        where: {
          userId: userId,
          groupId: groupId,
        },
      });

      if (!foundGroupMember) {
        return next(
          new BaseException(
            `User ${userId} was never joined to group ${groupId}`,
            400
          )
        );
      }

      // Detroy the link between user and group
      await foundGroupMember.destory();

      // Respond to the client group left success
      res.status(201).json({
        success: true,
        message: 'Left group',
      });
    } catch (error: any) {
      // handle error
      next(error);
    }
  }
}
