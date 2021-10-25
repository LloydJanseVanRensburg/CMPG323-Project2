"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var ImageControllers_1 = require("../controllers/ImageControllers");
// import { AuthMiddleware } from '../middleware/AuthMiddleware';
var router = express_1.default.Router();
// Atuh version
// router.get('/:imageKey', AuthMiddleware.auth ,ImageControllers.sendImageToClient);
// No auth version
router.get('/:imageKey', ImageControllers_1.ImageControllers.sendImageToClient);
exports.default = router;
