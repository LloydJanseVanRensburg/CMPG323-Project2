import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../modules/BaseException';
import {
  validateLoginAuthBody,
  validateRegisterAuthBody,
} from '../utils/functions';
import { AuthenticationService } from '../services/AuthenticationService';
import Parse from 'parse/node';

export class AuthControllers {
  static async logout(req: Request, res: Response, next: NextFunction) {
    // Handle session delete
    const sessionToken = req.headers['sessionToken'] as string;

    try {
      Parse.User.enableUnsafeCurrentUser();
      await Parse.User.become(sessionToken);
      await Parse.User.logOut();

      res.status(200).json({
        success: true,
        message: 'User logged out',
      });
    } catch (error: any) {
      next(error);
    }
  }

  static async loggedInUser(req: Request, res: Response, next: NextFunction) {
    try {
      let userId = req.headers['userId'];
      let sessionToken = req.headers['sessionToken'];

      const query = new Parse.Query(Parse.User);
      query.equalTo('objectId', userId);

      const user = await query.first({ useMasterKey: true });

      if (!user) {
        return next(new BaseException('User not found', 404));
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user.id,
            username: user.get('name'),
            email: user.get('email'),
            sessionToken: sessionToken,
            profilePicture: user.get('profilePicture'),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateLoginAuthBody(req.body)) {
        return next(
          new BaseException('Please provide all email and password', 400)
        );
      }

      // Email  and Password Required for login
      let { email, password } = req.body;

      const data = await AuthenticationService.login({ email, password });

      res.status(200).json(data);
    } catch (error: any) {
      next(new BaseException(error.message, error.statusCode));
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRegisterAuthBody(req.body)) {
        return next(
          new BaseException('Please provide all email and password', 400)
        );
      }

      // Email, Username, Password, ProfileImgURL
      let { email, username, password, profilePicture } = req.body;

      let registerData = {
        email,
        username: email,
        name: username,
        password,
        profilePicture: profilePicture ?? 'ea83409a099cfe26db0a435faf362b31',
      };

      const data = await AuthenticationService.register(registerData);

      res.status(200).json(data);
    } catch (error: any) {
      next(new BaseException(error.message, error.statusCode));
    }
  }
}
