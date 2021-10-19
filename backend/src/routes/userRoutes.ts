import express from 'express';
import { UserControllers } from '../controllers/UserControllers';

const router = express.Router();

router.get('/', UserControllers.getAll);

router.get('/:userId', UserControllers.getById);
router.put('/:userId', UserControllers.updateById);
router.delete('/:userId', UserControllers.deleteById);

export default router;
