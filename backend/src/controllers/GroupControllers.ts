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

      let message = `
        <h1>Your Special Invite</h1>
      `;

      emailInviteList.forEach(async (email: string) => {
        EmailServices.sendEmail({
          to: email,
          subject: 'You have been invited to join a group',
          text: message,
        });
      });

      res.status(200).json({
        success: true,
        message: 'Invites sent',
      });

      // Check if these emails are actuall users of the app
      // Check that they are not part of group already
      // Send out emails to email list
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static async joinGroup(req: Request, res: Response, next: NextFunction) {
    try {
      // check if this user received invite
      // then add this user to the group member table
      // respond to client with a redirect to the group page that was joined
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static async leaveGroup(req: Request, res: Response, next: NextFunction) {
    try {
      // Get groupId and userId
      // Parse Query the group members table by userId and groupId
      // Detroy the link between user and group
      // Respond to the client group left success
    } catch (error: any) {
      // handle error
      next(error);
    }
  }
}
