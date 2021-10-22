import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import Parse from 'parse/node';
import { validateCreateGroupBody } from '../utils/functions';
import { BaseException } from '../modules/BaseException';
import { uploadFile } from '../middleware/FileUploadMiddleware';
import { unlinkFile } from '..';
import { ImageProcessing } from '../services/ImageProcessing';
import { EmailServices } from '../services/EmailingServices';

export class GroupControllers {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Parse Query All Groups
      const query = new Parse.Query(Parse.Object.extend('Groups'));

      // Pagination Abilities to finding all groups
      // url example -> /api/v1/groups?page=1&limit=10
      let { page, limit } = req.query;

      let pageNumber = Number(page) || 1;
      let limitNumber = Number(limit) || 15;

      // Pagination Logic
      query.skip((pageNumber - 1) * limitNumber);
      query.limit(limitNumber);

      // Get Groups and format correct for response
      const groups = await query.find();
      const formattedGroups = groups.map((group: any) => {
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
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      let userId = req.headers['userId'];

      // Validate Body data
      if (!validateCreateGroupBody(req.body)) {
        return next(new BaseException('Please  provide all fields', 400));
      }

      // Get Body Data and File
      const { title, description } = req.body;
      let file = req.file;

      // Upload File to S3 Bucket
      if (!file) {
        return next(
          new BaseException(
            'Not group picture provided please provide image',
            400
          )
        );
      }

      // Optimize the image file
      const optimizedImgBuffer = await ImageProcessing.optimize(file.path);

      const result = await uploadFile(optimizedImgBuffer, file.filename);
      let imageKey = result.Key;

      // Delete the image file from API server once sent to S3
      await unlinkFile(file.path);

      // Fetching Current User
      const query = new Parse.Query(Parse.User);
      query.equalTo('objectId', userId);
      const user = await query.first();

      if (!user) {
        return next(new BaseException('User not found', 404));
      }

      // Data that builds up group
      let groupData = {
        title,
        description,
        imageKey,
        owner: user,
        memberCount: 0,
      };

      // Creating Group
      const group = new Parse.Object('Groups');
      group.set(groupData);
      const newGroup = await group.save();

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
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      // Get groupId from params
      let { groupId } = req.params;

      // Parse Query for group with objectId
      const query = new Parse.Query(Parse.Object.extend('Groups'));
      query.equalTo('objectId', groupId);

      const foundGroup = await query.first();

      if (!foundGroup) {
        return next(
          new BaseException(`Group with objectId: ${groupId} not found`, 404)
        );
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
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      // Find the groups that is being updated
      let { groupId } = req.params;

      const queryGroup = new Parse.Query(Parse.Object.extend('Groups'));
      queryGroup.equalTo('objectId', groupId);
      const foundGroup = await queryGroup.first();

      // Check if group found
      if (!foundGroup) {
        return next(
          new BaseException(
            `Group with objectId: ${groupId} was not found`,
            404
          )
        );
      }

      // TODO:
      // Maby re structure that group has relation 'admin' and check that
      // only admin have ability to edit group

      // Check that one to update is owner
      let userId = req.headers['userId'];
      let ownerId = foundGroup.get('owner').id;

      if (userId !== ownerId) {
        return next(
          new BaseException('You are not authorizated to do this', 401)
        );
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

      // Data that builds up group
      let groupData: any = {};

      if (title) groupData.title = title;
      if (description) groupData.description = description;
      if (imageKey) {
        // TODO:
        // Handle any file delete  of the group profile picture if image changed

        groupData.imageKey = imageKey;
      }

      // Creating Group
      foundGroup.set(groupData);
      const updatedGroup = await foundGroup.save();

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
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      // Get groupId from params
      let { groupId } = req.params;

      const groupQuery = new Parse.Query(Parse.Object.extend('Groups'));

      groupQuery.equalTo('objectId', groupId);

      const foundGroup = await groupQuery.first();

      if (!foundGroup) {
        return next(
          new BaseException(`Group with objectId ${groupId} was not found`, 404)
        );
      }

      // Destroy group
      await foundGroup.destroy();

      // TODO:
      // Handle any file delete  of the group profile picture

      // Respond back to client delete success
      res.status(200).json({
        success: true,
        message: 'Group deleted',
      });
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static async inviteToGroup(req: Request, res: Response, next: NextFunction) {
    try {
      // Get list of emails to invite from req.body
      let { emailInviteList } = req.body;
      let { groupId } = req.params;

      const groupQuery = new Parse.Query(Parse.Object.extend('Groups'));
      groupQuery.equalTo('objectId', groupId);
      const foundGroup = await groupQuery.first();
      if (!foundGroup) {
        return next(
          new BaseException(`Group with objectId ${groupId} was not found`, 404)
        );
      }

      const cleanEmailList = [];

      for (let i = 0; i < emailInviteList.length; i++) {
        // Check that user is registered
        let email = emailInviteList[i];

        const userQuery = new Parse.Query(Parse.User);
        userQuery.equalTo('email', email);
        const foundUser = await userQuery.first();
        if (!foundUser) {
          continue;
        }

        // Check that user is not part of group already
        const groupMemberQuery = new Parse.Query(
          Parse.Object.extend('GroupMembers')
        );
        groupMemberQuery.equalTo('userId', foundUser.id);
        groupMemberQuery.equalTo('groupId', foundGroup.id);
        const isMember = Boolean(await groupMemberQuery.first());
        if (isMember) {
          continue;
        }

        // Remove and invites that is already in group invites for this user and group combo
        const groupInvitesQouery = new Parse.Query(
          Parse.Object.extend('GroupInvites')
        );
        groupInvitesQouery.equalTo('email', email);
        groupInvitesQouery.equalTo('groupId', groupId);
        const foundGroupInvites = await groupInvitesQouery.find();

        foundGroupInvites.forEach(async (invite) => {
          await invite.destroy();
        });

        let inviteObj = {
          userId: foundUser.id,
          groupId: foundGroup.id,
          email: foundUser.get('username'),
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
        const groupInvite = new Parse.Object('GroupInvites');
        groupInvite.set({
          email: invite.email,
          groupId: invite.groupId,
          token: token,
        });
        await groupInvite.save();

        // Send Email
        EmailServices.sendEmail({
          to: invite.email,
          subject: `Group Invite From ${foundGroup.get('title')}`,
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
      const groupInviteQuery = new Parse.Query(
        Parse.Object.extend('GroupInvites')
      );
      groupInviteQuery.equalTo('email', email);
      groupInviteQuery.equalTo('groupId', groupId);
      groupInviteQuery.equalTo('token', token);

      const foundGroupInvite = await groupInviteQuery.first();

      if (!foundGroupInvite) {
        return next(new BaseException('You where not invited, sorry!', 404));
      }

      // Get user from email
      const userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo('email', email);
      const foundUser = await userQuery.first();

      if (!foundUser) {
        return next(
          new BaseException(`No user with email ${email} was found`, 404)
        );
      }

      // Add this user as member of group to groupMembers class
      const groupMember = new Parse.Object('GroupMembers');
      groupMember.set({
        userId: foundUser.id,
        groupId: groupId,
      });

      await groupMember.save();

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

      // Parse Query the group members table by userId and groupId
      const groupMemberQuery = new Parse.Query(
        Parse.Object.extend('GroupMembers')
      );
      groupMemberQuery.equalTo('userId', userId);
      groupMemberQuery.equalTo('groupId', groupId);
      const foundGroupMember = await groupMemberQuery.first();

      if (!foundGroupMember) {
        return next(
          new BaseException(
            `User ${userId} was never joined to group ${groupId}`,
            400
          )
        );
      }

      // Detroy the link between user and group
      await foundGroupMember.destroy();

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
