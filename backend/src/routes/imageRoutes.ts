import express from 'express';
import { ImageControllers } from '../controllers/ImageControllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = express.Router();

// @route   -   /api/v1/image/:imageKey
// @desc    -   GET fetch the image from AWS S3
// @access  -   Private
router.get('/:imageKey', ImageControllers.sendImageToClient);

export default router;
