import express from 'express';
import { UserControllers } from '../controllers/UserControllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = express.Router();

// @route   -   /api/v1/users
// @desc    -   GET fetch all users
// @access  -   Private
router.get('/', AuthMiddleware.auth, UserControllers.getAll);

// @route   -   /api/v1/users/:userId
// @desc    -   GET fetch user by id
// @access  -   Private
router.get('/:userId', AuthMiddleware.auth, UserControllers.getById);

// @route   -   /api/v1/users/:userId
// @desc    -   DELETE remove user by id
// @access  -   Private
router.delete('/:userId', AuthMiddleware.auth, UserControllers.deleteById);

export default router;
