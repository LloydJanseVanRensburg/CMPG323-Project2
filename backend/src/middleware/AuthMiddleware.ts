import Parse from 'parse/node';
import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../modules/BaseException';
import jwt from 'jsonwebtoken';

export class AuthMiddleware {
  static async auth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return next(new BaseException('Access denied not authorized', 401));
    }

    let token = req.headers.authorization.split(' ')[1];

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const query = new Parse.Query(Parse.Session);
      query.equalTo('sessionToken', decoded.sessionToken);

      const result = await query.first({ useMasterKey: true });

      if (!result) {
        return next(
          new BaseException('No session found please login again', 404)
        );
      }

      const user = result.get('user');

      if (user.id !== decoded.userId) {
        return next(new BaseException('Access denied not authorized', 401));
      }

      req.headers['userId'] = decoded.userId;
      req.headers['sessionToken'] = decoded.sessionToken;

      next();
    } catch (error) {
      next(error);
    }
  }
}
