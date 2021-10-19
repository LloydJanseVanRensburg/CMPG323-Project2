import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../modules/BaseException';
import {
  validateLoginAuthBody,
  validateRegisterAuthBody,
} from '../utils/functions';
import { AuthenticationService } from '../services/AuthenticationService';

export class AuthControllers {
  // TODO:   Error in the Try is not loggin correct chec that out!
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
      next(new BaseException(error.message, 500, error.code));
    }
  }

  // TODO:   Error in the Try is not loggin correct chec that out!
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!validateRegisterAuthBody(req.body)) {
        return next(
          new BaseException('Please provide all email and password', 400)
        );
      }

      // Email, Username, Password, ProfileImgURL
      let { email, username, password, profilePrictureUrl } = req.body;

      let registerData = {
        email,
        username: email,
        name: username,
        password,
        profilePrictureUrl:
          profilePrictureUrl ??
          'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png',
      };

      const data = await AuthenticationService.register(registerData);

      res.status(200).json(data);
    } catch (error: any) {
      console.trace(error.message);
      console.trace(error.code);
      next(new BaseException(error.message, 500, error.code));
    }
  }
}
