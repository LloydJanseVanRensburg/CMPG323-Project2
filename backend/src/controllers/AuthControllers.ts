import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../modules/BaseException';
import { AuthenticationService } from '../services/AuthenticationService';
import { RegisterObject } from '../interfaces/interfaces';
import {
  validateLoginAuthBody,
  validateRegisterAuthBody,
} from '../utils/functions';
import User from '../models/User';

export class AuthControllers {
  static async loggedInUser(req: Request, res: Response, next: NextFunction) {
    try {
      let userId = req.headers['userId'];

      const user = await User.findById(userId);

      if (!user) {
        return next(new BaseException('User not found', 404));
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate Login Request body
      if (!validateLoginAuthBody(req.body)) {
        return next(
          new BaseException('Please provide all email and password', 400)
        );
      }

      // Email  and Password Required for login
      let { email, password } = req.body;

      // Login Service
      const data = await AuthenticationService.login({ email, password });

      // Respond to client login data
      res.status(200).json(data);
    } catch (error: any) {
      // Handle Error
      next(new BaseException(error.message, error.statusCode));
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate Request Body
      if (!validateRegisterAuthBody(req.body)) {
        return next(
          new BaseException('Please provide all email and password', 400)
        );
      }

      // Email, Username, Password, ProfilePicture
      let registerBody: RegisterObject = req.body;

      // Let pfp
      let profilePicture =
        registerBody.profilePicture ?? 'ea83409a099cfe26db0a435faf362b31';

      let registerData = {
        email: registerBody.email,
        username: registerBody.username,
        password: registerBody.password,
        profilePicture,
      };

      // Register Service
      const data = await AuthenticationService.register(registerData);

      // Respond to client with register data
      res.status(200).json(data);
    } catch (error: any) {
      // Handle error
      next(new BaseException(error.message, error.statusCode));
    }
  }
}
