import express from 'express';
import { GroupControllers } from '../controllers/GroupControllers';

const router = express.Router();

router.get('/', GroupControllers.getAll);
router.post('/', GroupControllers.create);
router.get('/:groupId', GroupControllers.getById);
router.put('/:groupId', GroupControllers.updateById);
router.delete('/:groupId', GroupControllers.deleteById);

export default router;
