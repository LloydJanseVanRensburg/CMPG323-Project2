"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageControllers = void 0;
const FileUploadMiddleware_1 = require("../middleware/FileUploadMiddleware");
class ImageControllers {
    static sendImageToClient(req, res, next) {
        const { imageKey } = req.params;
        if (!imageKey) {
            return res.status(404);
        }
        const readStream = (0, FileUploadMiddleware_1.getFileStream)(imageKey);
        readStream.pipe(res);
        res.status(200);
    }
}
exports.ImageControllers = ImageControllers;
