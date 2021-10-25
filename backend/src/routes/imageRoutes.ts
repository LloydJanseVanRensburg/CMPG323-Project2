import express from 'express';
import { ImageControllers } from '../controllers/ImageControllers';
// import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = express.Router();

// Atuh version
// router.get('/:imageKey', AuthMiddleware.auth ,ImageControllers.sendImageToClient);

// No auth version
router.get('/:imageKey', ImageControllers.sendImageToClient);

export default router;
