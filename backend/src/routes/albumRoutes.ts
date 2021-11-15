import express from 'express';
import { AlbumControllers } from '../controllers/AlbumControllers';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = express.Router();

// @route   -   /api/v1/albums
// @desc    -   GET fetch all albums
// @access  -   Private
router.get('/', AuthMiddleware.auth, AlbumControllers.getAll);

// @route   -   /api/v1/albums
// @desc    -   POST create new album
// @access  -   Private
router.post('/', AuthMiddleware.auth, AlbumControllers.createAlbum);

// @route   -   /api/v1/albums/:albumId
// @desc    -   GET fetch album by id
// @access  -   Private
router.get('/:albumId', AuthMiddleware.auth, AlbumControllers.getById);

// @route   -   /api/v1/albums/:albumId
// @desc    -   PUT update album by id
// @access  -   Private
router.put('/:albumId', AuthMiddleware.auth, AlbumControllers.updateById);

// @route   -   /api/v1/albums/:albumId
// @desc    -   DELETE remove album by id
// @access  -   Private
router.delete('/:albumId', AuthMiddleware.auth, AlbumControllers.deleteById);

export default router;
