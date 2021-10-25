import jwt from 'jsonwebtoken';
import { BaseException } from '../modules/BaseException';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { LoginObject, RegisterObject } from '../interfaces/interfaces';

export class AuthenticationService {
  static login(data: LoginObject) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email: data.email });

        if (!user) {
          return reject(new BaseException('Invalid email or password', 401));
        }

        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) {
          return reject(new BaseException('Invalid email or password', 401));
        }

        const payload = {
          userId: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
          expiresIn: '1d',
        });

        resolve({
          success: true,
          data: {
            token: token,
            user: {
              id: user._id,
              username: user.username,
              email: user.email,
              profilePicture: user.profilePicture,
            },
          },
        });
      } catch (error: any) {
        console.log(error.message);
        if (error.message === 'jwt expires') {
          reject(new BaseException('Token has expired', 401));
        } else {
          reject(error);
        }
      }
    });
  }

  static register(data: RegisterObject) {
    return new Promise(async (resolve, reject) => {
      try {
        // Check user don't exists already
        const foundUser = await User.findOne({ email: data.email });

        if (foundUser) {
          return reject(
            new BaseException('User already exsists with this email', 400)
          );
        }

        // Hash password
        let hashedPassword = await bcrypt.hash(data.password, 12);

        // Save  user
        const user = new User({
          username: data.username,
          email: data.email,
          password: hashedPassword,
          profilePicture: data.profilePicture,
        });
        const newUser = await user.save();

        // Creating and Sign JWT
        const payload = {
          userId: newUser._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
          expiresIn: '1d',
        });

        // Resolve with register data
        resolve({
          success: true,
          data: {
            token: token,
            user: {
              id: newUser._id,
              username: newUser.username,
              email: newUser.email,
              profilePicture: newUser.profilePicture,
            },
          },
        });
      } catch (error: any) {
        // Reject with Error
        reject(error);
      }
    });
  }
}
