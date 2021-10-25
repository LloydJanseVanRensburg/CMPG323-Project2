import { Request, Response, NextFunction } from 'express';
import { getFileStream } from '../middleware/FileUploadMiddleware';

export class ImageControllers {
  static sendImageToClient(req: Request, res: Response, next: NextFunction) {
    const { imageKey } = req.params;
    if (!imageKey) {
      return res.status(404);
    }

    const readStream = getFileStream(imageKey);

    readStream.pipe(res);
    res.status(200);
  }
}
