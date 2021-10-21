import { Request, Response, NextFunction } from 'express';
import Parse from 'parse/node';
import { validateCreateGroupBody } from '../utils/functions';
import { BaseException } from '../modules/BaseException';
import { uploadFile } from '../middleware/FileUploadMiddleware';
import { unlinkFile } from '..';

export class GroupControllers {
  static getAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Parse Query All Groups
      // Respond to client with all groups info
    } catch (error: any) {
      // handle error
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

      const result = await uploadFile(file);
      await unlinkFile(file.path);
      let imageKey = result.Key;

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
          ownerId: userId,
        },
      });
    } catch (error: any) {
      // handle error
      next(error);
    }
  }

  static getById(req: Request, res: Response, next: NextFunction) {
    try {
      // Get groupId from params
      // Parse Query for group with objectId
      // Respond back with group info to client
    } catch (error: any) {
      // handle error
    }
  }

  static async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      // Get groupId from params
      // Handle any fileupload on this route for group picture updates
      // Get body data for update
      // Parse Query for group by objectId
      // Update the data  found in body
      // Save back group
      // Respond to client with new group info
    } catch (error: any) {
      // handle error
    }
  }

  static async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      // Get groupId from params
      // Parse Query group by objectId
      // Destroy group
      // Handle any file delete  of the group profile picture
      // Respond back to client delete success
    } catch (error: any) {
      // handle error
    }
  }

  static async inviteToGroup(req: Request, res: Response, next: NextFunction) {
    try {
      // Get list of emails to invite from req.body
      // Check if these emails are actuall users of the app
      // Check that they are not part of group already
      // Send out emails to email list
    } catch (error: any) {
      // handle error
    }
  }

  static async joinGroup(req: Request, res: Response, next: NextFunction) {
    try {
      //
    } catch (error: any) {
      // handle error
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
    }
  }
}
