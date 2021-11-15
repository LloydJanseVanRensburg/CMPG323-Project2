import express from 'express';
import { AuthControllers } from '../controllers/AuthControllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = express.Router();

// @route   -   /api/v1/auth/logged-in
// @desc    -   GET fetch currently logged in user data
// @access  -   Private
router.get('/logged-in', AuthMiddleware.auth, AuthControllers.loggedInUser);

// @route   -   /api/v1/auth/login
// @desc    -   POST authenticate user and send token
// @access  -   Public
router.post('/login', AuthControllers.login);

// @route   -   /api/v1/auth/register
// @desc    -   POST register users, authenticate and send token
// @access  -   Public
router.post('/register', AuthControllers.register);

export default router;
