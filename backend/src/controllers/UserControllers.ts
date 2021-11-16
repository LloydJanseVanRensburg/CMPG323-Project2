import { Request, Response, NextFunction } from 'express';
import { httpStatusCode } from '../constants/httpStatusCodes';
import { BaseException } from '../modules/BaseException';

const db = require('../models');

export class UserControllers {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await db.user.findAll({
        attributes: {
          exclude: ['password'],
        },
      });

      res.status(httpStatusCode.OK).json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const foundUser = await db.user.findByPk(userId, {
        attributes: {
          exclude: ['password'],
        },
      });

      if (!foundUser) {
        next(BaseException.notFound());
        return;
      }

      res.status(httpStatusCode.OK).json({
        success: true,
        data: foundUser,
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const foundUser = await db.user.findByPk(userId);

      if (!foundUser) {
        next(BaseException.notFound());
        return;
      }

      await foundUser.destroy();

      res.status(httpStatusCode.OK).json({
        success: true,
        message: 'User deleted',
      });
    } catch (error: any) {
      next(error);
    }
  }
}
