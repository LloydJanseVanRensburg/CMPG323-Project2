import express from 'express';
import { AuthControllers } from '../controllers/AuthControllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = express.Router();

// @route /api/v1/auth/logged-in
// @desc - GET get current logged in use detials
// @access Private
router.get('/logged-in', AuthMiddleware.auth, AuthControllers.loggedInUser);

// @route /api/v1/auth/logout
// @desc - GET logout and delete user session
// @access Private
router.get('/logout', AuthMiddleware.auth, AuthControllers.logout);

// @route /api/v1/auth/login
// @desc - POST authenticate user and return access token
// @access Public
router.post('/login', AuthControllers.login);

// @route /api/v1/auth/register
// @desc - POST create user and return access token
// @access Public
router.post('/register', AuthControllers.register);

export default router;
