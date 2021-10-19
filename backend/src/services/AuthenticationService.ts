import Parse from 'parse/node';
import jwt from 'jsonwebtoken';

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
              id: result.get('objectId'),
              username: result.get('username'),
              email: result.get('email'),
              profilePrictureUrl: result.get('profilePrictureUrl'),
            },
          },
        });
      } catch (error: any) {
        console.trace(error.code, error.message);
        reject(new Error(error));
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
              id: result.get('objectId'),
              username: result.get('username'),
              email: result.get('email'),
              profilePrictureUrl: result.get('profilePrictureUrl'),
            },
          },
        });
      } catch (error: any) {
        console.trace(error.code, error.message);
        reject(new Error(error));
      }
    });
  }
}
