import fs from 'fs';
import multer from 'multer';
import aws from 'aws-sdk';

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_KEY!,
  region: process.env.AWS_REGION!,
});

export function uploadFile(file: any) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
}

export const getFileStream = (fileKey: any) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: process.env.AWS_S3_BUCKET!,
  };

  return s3.getObject(downloadParams).createReadStream();
};

export const upload = multer({ dest: 'uploads/' });
