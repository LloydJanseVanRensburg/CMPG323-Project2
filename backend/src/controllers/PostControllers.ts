import { Request, Response, NextFunction } from 'express';
import { httpStatusCode } from '../constants/httpStatusCodes';
import { BaseException } from '../modules/BaseException';
import {
  validateCreatePostBody,
  validateUpdatePostBody,
} from '../utils/requestValidations';

const db = require('../models');

export class PostControllers {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await db.post.findAll();

      res.status(httpStatusCode.OK).json({
        success: true,
        data: posts,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateCreatePostBody(req.body)) {
        next(BaseException.invalidRequestBody());
        return;
      }

      const { albumId, title, body, files } = req.body;
      // @ts-ignore
      const { id: userId } = req.user;

      // Check that album exists
      const foundAlbum = await db.album.findByPk(albumId);

      if (!foundAlbum) {
        next(BaseException.notFound());
        return;
      }

      // Check that user is group member
      const foundMember = await db.groupmember.findOne({
        where: {
          memberId: userId,
          groupId: foundAlbum.groupId,
        },
      });

      if (!foundMember) {
        next(BaseException.notAllowed());
        return;
      }

      const newPost = await db.post.create({
        albumId,
        title,
        body,
        files,
        userId,
      });

      res.status(httpStatusCode.CREATED).json({
        success: true,
        data: newPost,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;

      const foundPost = await db.post.findByPk(postId);

      if (!foundPost) {
        next(BaseException.notFound());
        return;
      }

      res.status(httpStatusCode.OK).json({
        success: true,
        data: foundPost,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateUpdatePostBody(req.body)) {
        next(BaseException.invalidRequestBody());
        return;
      }

      const { postId } = req.params;
      // @ts-ignore
      const { id: userId } = req.user;
      const { title, body, files } = req.body;

      const foundPost = await db.post.findByPk(postId);

      if (!foundPost) {
        next(BaseException.notFound());
        return;
      }

      // Check that album exists
      const foundAlbum = await db.album.findByPk(foundPost.albumId);

      if (!foundAlbum) {
        next(BaseException.notFound());
        return;
      }

      // Check that user is group member
      const foundMember = await db.groupmember.findOne({
        where: {
          memberId: userId,
          groupId: foundAlbum.groupId,
        },
      });

      if (!foundMember) {
        next(BaseException.notAllowed());
        return;
      }

      if (title) foundPost.title = title;
      if (body) foundPost.body = body;
      if (files) foundPost.files = files;

      const updatedPost = await foundPost.save();

      res.status(httpStatusCode.CREATED).json({
        success: true,
        data: updatedPost,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      // @ts-ignore
      const { id: userId } = req.user;

      const foundPost = await db.post.findByPk(postId);

      if (!foundPost) {
        next(BaseException.notFound());
        return;
      }

      // Check that member of group through album
      const foundAlbum = await db.album.findByPk(foundPost.albumId);

      if (!foundAlbum) {
        next(BaseException.notFound());
        return;
      }

      const foundMember = await db.groupmember.findOne({
        where: {
          memberId: userId,
          groupId: foundAlbum.groupId,
        },
      });

      if (!foundMember) {
        next(BaseException.notAllowed());
        return;
      }

      await foundPost.destroy();

      res.status(httpStatusCode.OK).json({
        success: true,
        data: null,
        message: 'Post deleted',
      });
    } catch (error: any) {
      next(error);
    }
  }
}
