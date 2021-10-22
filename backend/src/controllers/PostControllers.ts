import { Request, Response, NextFunction } from 'express';
import { uploadFile } from '../middleware/FileUploadMiddleware';
import { BaseException } from '../modules/BaseException';
import { ImageProcessing } from '../services/ImageProcessing';
// import { validateCreatePostBody } from '../utils/functions';

export class PostControllers {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (error) {}
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      // if(!validateCreatePostBody(req.body)) {
      //   return next(new BaseException("Please provide all required fields",  400));
      // }

      let { albumId, title, content } = req.body;

      let file = req.file;

      if (!file) {
        return next(
          new BaseException('Please provide all required fields', 400)
        );
      }

      const imageBuffer = await ImageProcessing.optimize(file.path);

      const result = await uploadFile(imageBuffer, file.filename);
      const imageKey = result.Key;

      // Get the album this post belongs to
      const albumQuery = new Parse.Query(Parse.Object.extend('Albums'));
      albumQuery.equalTo('objectId', albumId);
      const album = await albumQuery.first();

      // Get the current user
      const userId = req.headers['userId'];
      const userQuery = new Parse.Query(Parse.User);
      userQuery.equalTo('objectId', userId);
      const owner = await userQuery.first();

      let postData = {
        album: album,
        owner: owner,
        title,
        content,
        imageKey,
      };

      const post = new Parse.Object('Posts');
      post.set(postData);
      const newPost = await post.save();

      res.status(201).json({
        success: true,
        data: {
          id: newPost.id,
          title: newPost.get('title'),
          content: newPost.get('content'),
          postPicture: newPost.get('title'),
          ownerId: newPost.get('owner').id,
          albumId: newPost.get('album').id,
        },
      });
    } catch (error) {
      // handle error
      next(error);
    }
  }

  static getById(req: Request, res: Response, next: NextFunction) {}

  static updateById(req: Request, res: Response, next: NextFunction) {}

  static deleteById(req: Request, res: Response, next: NextFunction) {}
}
