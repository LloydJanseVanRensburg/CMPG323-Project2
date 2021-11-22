"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ImageControllers_1 = require("../controllers/ImageControllers");
const router = express_1.default.Router();
// @route   -   /api/v1/image/:imageKey
// @desc    -   GET fetch the image from AWS S3
// @access  -   Private
router.get('/:imageKey', ImageControllers_1.ImageControllers.sendImageToClient);
exports.default = router;
