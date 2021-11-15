import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../modules/BaseException';
import { httpStatusCode } from '../constants/httpStatusCodes';

const db = require('../models');

export class AlbumControllers {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
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
      // @ts-ignore
      const { id: userId } = req.user;
      const { groupId, title, description } = req.body;

      // TODO: Validate Req.body
      // TODO: Ensure user is group member of groupId

      const newAlbum = await db.album.create({
        title,
        description,
        creator: userId,
        groupId,
      });

      res.status(httpStatusCode.CREATED).json({
        success: true,
        data: newAlbum,
      });
    } catch (error: any) {
      console.trace(error);
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
      const { albumId } = req.params;
      const { title, description } = req.body;
      // @ts-ignore
      const { id: userId } = req.user;

      // TODO: Validate req.body

      const foundAlbum = await db.album.findByPk(albumId);

      if (!foundAlbum) {
        next(BaseException.notFound());
        return;
      }

      // TODO: Ensure user is creator of album

      if (title) foundAlbum.title = title;
      if (description) foundAlbum.description = description;

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

      // TODO: Ensure user is creator of album

      res.status(httpStatusCode.OK).json({
        success: true,
        data: null,
        message: 'Successfully deleted',
      });
    } catch (error: any) {
      console.trace(error);
      next(error);
    }
  }
}
