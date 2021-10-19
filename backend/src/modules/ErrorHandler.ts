import fs from 'fs';

import { NextFunction, Response } from 'express';
import { BaseException } from './BaseException';

export class ErrorHandler {
  static isTrustedError(error: any): boolean {
    if (error instanceof BaseException) {
      return true;
    } else {
      return false;
    }
  }

  static fatale(err: any, res: Response, next: NextFunction) {
    console.log('==============Handling fatale error===========');
    console.log(err);

    let error = `
    Server Error: ${Date.now()}
    error: ${err}
    message: ${err.message}
    stack trace: ${err.stack}
    `;

    fs.writeFile(
      `./logs/fatale-${Date.now()}.txt`,
      error,
      { flag: 'w+' },
      function (err) {
        if (err) return console.log(err);
        console.log('Fatale Log File Created - Check ./logs dir');
      }
    );

    res.status(500).json({
      msg: 'Server Error',
    });
  }
}
