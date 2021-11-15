import express from 'express';
import { PostControllers } from '../controllers/PostControllers';
import { upload } from '../middleware/FileUploadMiddleware';

const router = express.Router();

// @route   -   /api/v1/posts
// @desc    -   GET fetch all posts
// @access  -   Private
router.get('/', PostControllers.getAll);

// @route   -   /api/v1/posts
// @desc    -   POST create new post
// @access  -   Private
router.post('/', upload.single('image'), PostControllers.create);

// @route   -   /api/v1/posts/:postId
// @desc    -   GET fetch post by id
// @access  -   Private
router.get('/:postId', PostControllers.getById);

// @route   -   /api/v1/posts
// @desc    -   PUT update post by id
// @access  -   Private
router.put('/:postId', PostControllers.updateById);

// @route   -   /api/v1/posts
// @desc    -   DELETE remove user by id
// @access  -   Private
router.delete('/:postId', PostControllers.deleteById);

export default router;
