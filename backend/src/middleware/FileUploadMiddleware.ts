import multer from 'multer';
import aws from 'aws-sdk';

// Adding AWS IAM credentials created for this app
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY!,
  region: process.env.AWS_REGION!,
});

// Uploading File to AWS S3
export function uploadFile(fileBuffer: Buffer, filename: string) {
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Body: fileBuffer,
    Key: Date.now() + '_' + filename,
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
