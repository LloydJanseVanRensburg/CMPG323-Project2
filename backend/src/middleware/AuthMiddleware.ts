// 3rd Party Modules
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Custom Error
import { BaseException } from '../modules/BaseException';

const db = require('../models');

export class AuthMiddleware {
  static async auth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return next(new BaseException('Access denied not authorized', 401));
    }

    let token = req.headers.authorization.split(' ')[1];

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const user = await db.User.findByPk(decoded.userId);

      // TODO:  More  security  check
      // 1) Banned user
      // 2) Reset password date vs token issued date

      if (!user) {
        return next(new BaseException('Access denied not authorized', 401));
      }

      // @ts-ignore
      req.user = user;

      next();
    } catch (error: any) {
      if (error.message === 'jwt malformed') {
        return next(new BaseException('Access denied invalid token', 401));
      }

      next(error);
    }
  }
}
