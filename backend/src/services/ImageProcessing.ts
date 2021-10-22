import sharp from 'sharp';

export class ImageProcessing {
  static optimize(filePath: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        // Sharp package optimize and resize the image and send buffer in promise
        let optimizedImage = sharp(filePath)
          .resize(1000, 1000, {
            fit: sharp.fit.inside,
          })
          .jpeg({ quality: 85 })
          .toBuffer();

        // Send back optimized and resized image buffer
        resolve(optimizedImage);
      } catch (error) {
        // Handle Error
        reject(error);
      }
    });
  }
}
