import express from 'express';
import { PostControllers } from '../controllers/PostControllers';
import { upload } from '../middleware/FileUploadMiddleware';

const router = express.Router();

router.get('/', PostControllers.getAll);
router.post('/', upload.single('image'), PostControllers.create);
router.get('/:postId', PostControllers.getById);
router.put('/:postId', PostControllers.updateById);
router.delete('/:postId', PostControllers.deleteById);

export default router;
