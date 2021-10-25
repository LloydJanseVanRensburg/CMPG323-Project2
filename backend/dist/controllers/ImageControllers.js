"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageControllers = void 0;
var FileUploadMiddleware_1 = require("../middleware/FileUploadMiddleware");
var ImageControllers = /** @class */ (function () {
    function ImageControllers() {
    }
    ImageControllers.sendImageToClient = function (req, res, next) {
        var imageKey = req.params.imageKey;
        if (!imageKey) {
            return res.status(404);
        }
        var readStream = FileUploadMiddleware_1.getFileStream(imageKey);
        readStream.pipe(res);
        res.status(200);
    };
    return ImageControllers;
}());
exports.ImageControllers = ImageControllers;
