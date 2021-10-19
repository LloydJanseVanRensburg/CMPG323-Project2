import express from 'express';
import { AuthControllers } from '../controllers/AuthControllers';

const router = express.Router();

router.post('/login', AuthControllers.login);
router.post('/register', AuthControllers.register);

export default router;
