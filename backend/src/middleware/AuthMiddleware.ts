// 3rd Party Modules
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Custom Error
import { BaseException } from '../modules/BaseException';

// Database models
const db = require('../models');

export class AuthMiddleware {
  static async auth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      next(BaseException.notAllowed());
      return;
    }

    let token = req.headers.authorization.split(' ')[1];

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const user = await db.user.findByPk(decoded.userId);

      // TODO:  More  security  check
      // 1) Banned user
      // 2) Reset password date vs token issued date

      if (!user) {
        next(BaseException.notAllowed());
        return;
      }

      // @ts-ignore
      req.user = user;

      next();
    } catch (error: any) {
      if (error.message === 'jwt malformed') {
        next(BaseException.invalidToken());
        return;
      }

      next(error);
    }
  }
}
