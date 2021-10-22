"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.getFileStream = exports.uploadFile = void 0;
var multer_1 = __importDefault(require("multer"));
var aws_sdk_1 = __importDefault(require("aws-sdk"));
// Adding AWS IAM credentials created for this app
var s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
});
// Uploading File to AWS S3
function uploadFile(fileBuffer, filename) {
    var uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Body: fileBuffer,
        Key: filename,
    };
    return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;
var getFileStream = function (fileKey) {
    var downloadParams = {
        Key: fileKey,
        Bucket: process.env.AWS_S3_BUCKET,
    };
    return s3.getObject(downloadParams).createReadStream();
};
exports.getFileStream = getFileStream;
exports.upload = multer_1.default({ dest: 'uploads/' });
