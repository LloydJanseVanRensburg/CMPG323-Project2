import Parse from 'parse/node';
import jwt from 'jsonwebtoken';
import { BaseException } from '../modules/BaseException';
import { nextTick } from 'process';

interface RegisterObject {
  username: string;
  email: string;
  password: string;
  profilePrictureUrl?: string;
}

interface LoginObject {
  email: string;
  password: string;
}

export class AuthenticationService {
  static login(data: LoginObject) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await Parse.User.logIn(data.email, data.password);
        const sessionToken = result.getSessionToken();

        const payload = {
          userId: result.id,
          sessionToken: sessionToken,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
          expiresIn: '1d',
        });

        resolve({
          success: true,
          data: {
            token: token,
            user: {
              id: result.id,
              username: result.get('name'),
              email: result.get('email'),
              profilePicture: result.get('profilePicture'),
            },
          },
        });
      } catch (error: any) {
        console.log(error.message);
        if (error.message === 'jwt expires') {
          reject(new BaseException('Token has expired', 401));
        } else if (error.message === 'Invalid username/password.') {
          console.log('fired');
          reject(new BaseException('Invalid email or password', 400));
        } else {
          reject(error);
        }
      }
    });
  }

  static register(data: RegisterObject) {
    const user = new Parse.User();

    return new Promise(async (resolve, reject) => {
      try {
        user.set(data);

        const result = await user.signUp();

        const payload = {
          userId: result.id,
          sessionToken: result.getSessionToken(),
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
          expiresIn: '1d',
        });

        resolve({
          success: true,
          data: {
            token: token,
            user: {
              id: result.id,
              username: result.get('name'),
              email: result.get('email'),
              profilePicture: result.get('profilePicture'),
            },
          },
        });
      } catch (error: any) {
        reject(error);
      }
    });
  }
}
