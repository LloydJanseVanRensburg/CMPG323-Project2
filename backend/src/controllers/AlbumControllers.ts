import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../modules/BaseException';
import { httpStatusCode } from '../constants/httpStatusCodes';
import {
  validateCreateAlbumBody,
  validateUpdateAlbumBody,
  validateGetGroupAlbumBody,
} from '../utils/requestValidations';
import { ImageProcessing } from '../services/ImageProcessing';
import { upload, uploadFile } from '../middleware/FileUploadMiddleware';
import { unlinkFile } from '../utils/deleteFiles';

const db = require('../models');

export class AlbumControllers {
  static async getAllGroupAlbums(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!validateGetGroupAlbumBody(req.body)) {
        next(BaseException.invalidRequestBody());
        return;
      }

      const { groupId } = req.body;

      const foundGroupAlbums = await db.album.findAll({ where: { groupId } });

      res.status(httpStatusCode.OK).json({
        success: true,
        count: foundGroupAlbums.length,
        data: foundGroupAlbums,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {} = req.body;
      const albums = await db.album.findAll();

      res.status(httpStatusCode.OK).json({
        success: true,
        count: albums.length,
        data: albums,
      });
    } catch (error: any) {
      console.trace(error);
      next(error);
    }
  }

  static async createAlbum(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateCreateAlbumBody(req.body)) {
        next(BaseException.invalidRequestBody());
        return;
      }

      // @ts-ignore
      const { id: userId } = req.user;
      const { groupId, title, description, color } = req.body;

      // Check that group exists
      const foundGroup = await db.group.findByPk(groupId);

      if (!foundGroup) {
        next(BaseException.notFound());
        return;
      }

      // Check that group member exists
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

      const newAlbum = await db.album.create({
        title,
        description,
        creator: userId,
        groupId,
        color,
      });

      res.status(httpStatusCode.CREATED).json({
        success: true,
        data: newAlbum,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { albumId } = req.params;

      const foundAlbum = await db.album.findByPk(albumId);

      if (!foundAlbum) {
        next(BaseException.notFound());
        return;
      }

      res.status(httpStatusCode.OK).json({
        success: true,
        data: foundAlbum,
      });
    } catch (error: any) {
      console.trace(error);
      next(error);
    }
  }

  static async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateUpdateAlbumBody(req.body)) {
        next(BaseException.invalidRequestBody());
        return;
      }

      const { albumId } = req.params;
      const { title, description, color } = req.body;
      // @ts-ignore
      const { id: userId } = req.user;

      // Check that album exists
      const foundAlbum = await db.album.findByPk(albumId);

      if (!foundAlbum) {
        next(BaseException.notFound());
        return;
      }

      // Check that user is album creator
      if (foundAlbum.creator !== userId) {
        next(BaseException.notAllowed());
        return;
      }

      if (title) foundAlbum.title = title;
      if (description) foundAlbum.description = description;
      if (color) foundAlbum.color = color;

      const updatedAlbum = await foundAlbum.save();

      res.status(httpStatusCode.CREATED).json({
        success: true,
        data: updatedAlbum,
      });
    } catch (error: any) {
      console.trace(error);
      next(error);
    }
  }

  static async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { albumId } = req.params;
      // @ts-ignore
      const { id: userId } = req.user;

      const foundAlbum = await db.album.findByPk(albumId);

      if (!foundAlbum) {
        next(BaseException.notFound());
        return;
      }

      if (foundAlbum.creator !== userId) {
        next(BaseException.notAllowed());
        return;
      }

      await foundAlbum.destroy();

      res.status(httpStatusCode.OK).json({
        success: true,
        data: null,
        message: 'Successfully deleted',
      });
    } catch (error: any) {
      next(error);
    }
  }
}
