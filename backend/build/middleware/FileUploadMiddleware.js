"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.getFileStream = exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// Adding AWS IAM credentials created for this app
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    region: process.env.AWS_REGION,
});
// Uploading File to AWS S3
function uploadFile(fileBuffer, filename) {
    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Body: fileBuffer,
        Key: Date.now() + '_' + filename,
    };
    return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;
const getFileStream = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: process.env.AWS_S3_BUCKET,
    };
    return s3.getObject(downloadParams).createReadStream();
};
exports.getFileStream = getFileStream;
exports.upload = (0, multer_1.default)({ dest: 'uploads/' });
