import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../modules/BaseException';
import { AuthenticationService } from '../services/AuthenticationService';
import {
  validateLoginAuthBody,
  validateRegisterAuthBody,
} from '../utils/requestValidations';
import { httpStatusCode } from '../constants/httpStatusCodes';
const db = require('../models');

export class AuthControllers {
  static async loggedInUser(req: Request, res: Response, next: NextFunction) {
    try {
      // @ts-ignore
      const { id: userId } = req.user;

      const user = await db.user.findByPk(userId, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        next(BaseException.notFound());
        return;
      }

      res.status(httpStatusCode.OK).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate Login Request body
      if (!validateLoginAuthBody(req.body)) {
        next(BaseException.invalidRequestBody());
        return;
      }

      // Email  and Password Required for login
      let { email, password } = req.body;

      // Login Service
      const data = await AuthenticationService.login({ email, password });

      // Respond to client login data
      res.status(httpStatusCode.OK).json(data);
    } catch (error: any) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate Request Body
      if (!validateRegisterAuthBody(req.body)) {
        next(BaseException.invalidRequestBody());
        return;
      }

      let { email, username, password } = req.body;

      let registerData = {
        email,
        username,
        password,
        profilePicture: 'ea83409a099cfe26db0a435faf362b31',
      };

      // Register Service
      const data = await AuthenticationService.register(registerData);

      // Respond to client with register data
      res.status(httpStatusCode.CREATED).json(data);
    } catch (error: any) {
      next(error);
    }
  }
}
