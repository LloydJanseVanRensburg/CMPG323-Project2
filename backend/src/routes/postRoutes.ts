import express from 'express';
import { PostControllers } from '../controllers/PostControllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { upload } from '../middleware/FileUploadMiddleware';

const router = express.Router();

// @route   -   /api/v1/posts/album-posts
// @desc    -   GET fetch all posts
// @access  -   Private
router.post(
  '/album-posts',
  AuthMiddleware.auth,
  PostControllers.getAllAlbumPosts
);

// @route   -   /api/v1/posts/upload
// @desc    -   POST upload post files
// @access  -   Private
router.post(
  '/upload',
  AuthMiddleware.auth,
  upload.array('image'),
  PostControllers.uploadPostImages
);

// @route   -   /api/v1/posts
// @desc    -   GET fetch all posts
// @access  -   Private
router.get('/', AuthMiddleware.auth, PostControllers.getAll);

// @route   -   /api/v1/posts
// @desc    -   POST create new post
// @access  -   Private
router.post('/', AuthMiddleware.auth, PostControllers.create);

// @route   -   /api/v1/posts/:postId
// @desc    -   GET fetch post by id
// @access  -   Private
router.get('/:postId', AuthMiddleware.auth, PostControllers.getById);

// @route   -   /api/v1/posts
// @desc    -   PUT update post by id
// @access  -   Private
router.put('/:postId', AuthMiddleware.auth, PostControllers.updateById);

// @route   -   /api/v1/posts
// @desc    -   DELETE remove user by id
// @access  -   Private
router.delete('/:postId', AuthMiddleware.auth, PostControllers.deleteById);

export default router;
