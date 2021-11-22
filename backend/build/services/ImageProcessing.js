"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageProcessing = void 0;
const sharp_1 = __importDefault(require("sharp"));
class ImageProcessing {
    static optimize(filePath) {
        return new Promise(async (resolve, reject) => {
            try {
                // Sharp package optimize and resize the image and send buffer in promise
                let optimizedImage = (0, sharp_1.default)(filePath)
                    .resize(1000, 1000, {
                    fit: sharp_1.default.fit.inside,
                })
                    .jpeg({ quality: 85 })
                    .toBuffer();
                // Send back optimized and resized image buffer
                resolve(optimizedImage);
            }
            catch (error) {
                // Handle Error
                reject(error);
            }
        });
    }
}
exports.ImageProcessing = ImageProcessing;
