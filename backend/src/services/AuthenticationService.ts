import jwt from 'jsonwebtoken';
import { BaseException } from '../modules/BaseException';
import bcrypt from 'bcryptjs';
import { LoginObject, RegisterObject } from '../interfaces/interfaces';
import { ProcessCredentials } from 'aws-sdk';

const db = require('../models');

export class AuthenticationService {
  static login(data: LoginObject) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db.user.findOne({
          where: { email: data.email },
        });

        if (!user) {
          return reject(BaseException.invalidCredentials());
        }

        const isMatch = await bcrypt.compare(data.password, user.password);

        if (!isMatch) {
          return reject(BaseException.invalidCredentials());
        }

        // Building JWT Token payload
        const payload = {
          userId: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
          expiresIn: process.env.JWT_EXPIRES_IN!,
        });

        resolve({
          success: true,
          data: {
            token: token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              profilePicture: user.profilePicture,
            },
          },
        });
      } catch (error: any) {
        if (error.message === 'jwt expires') {
          reject(BaseException.expiredToken());
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
        const foundUser = await db.user.findOne({
          where: { email: data.email },
        });

        if (foundUser) {
          return reject(BaseException.alreadyRegistered());
        }

        // Hash password
        let hashedPassword = await bcrypt.hash(data.password, 12);

        // Save  user
        const newUser = await db.user.create({
          username: data.username,
          email: data.email,
          password: hashedPassword,
          profilePicture: data.profilePicture,
        });

        // Creating and Sign JWT
        const payload = {
          userId: newUser._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
          expiresIn: process.env.JWT_EXPIRES_IN!,
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
