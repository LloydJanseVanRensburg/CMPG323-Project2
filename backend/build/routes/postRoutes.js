"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PostControllers_1 = require("../controllers/PostControllers");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const FileUploadMiddleware_1 = require("../middleware/FileUploadMiddleware");
const cors_1 = __importDefault(require("cors"));
const router = express_1.default.Router();
// @route   -   /api/v1/posts/album-posts
// @desc    -   GET fetch all posts
// @access  -   Private
router.post('/album-posts', AuthMiddleware_1.AuthMiddleware.auth, PostControllers_1.PostControllers.getAllAlbumPosts);
// @route   -   /api/v1/posts/upload
// @desc    -   POST upload post files
// @access  -   Private
router.post('/upload', (0, cors_1.default)(), AuthMiddleware_1.AuthMiddleware.auth, FileUploadMiddleware_1.upload.array('image'), PostControllers_1.PostControllers.uploadPostImages);
// @route   -   /api/v1/posts
// @desc    -   GET fetch all posts
// @access  -   Private
router.get('/', AuthMiddleware_1.AuthMiddleware.auth, PostControllers_1.PostControllers.getAll);
// @route   -   /api/v1/posts
// @desc    -   POST create new post
// @access  -   Private
router.post('/', AuthMiddleware_1.AuthMiddleware.auth, PostControllers_1.PostControllers.create);
// @route   -   /api/v1/posts/:postId
// @desc    -   GET fetch post by id
// @access  -   Private
router.get('/:postId', AuthMiddleware_1.AuthMiddleware.auth, PostControllers_1.PostControllers.getById);
// @route   -   /api/v1/posts
// @desc    -   PUT update post by id
// @access  -   Private
router.put('/:postId', AuthMiddleware_1.AuthMiddleware.auth, PostControllers_1.PostControllers.updateById);
// @route   -   /api/v1/posts
// @desc    -   DELETE remove user by id
// @access  -   Private
router.delete('/:postId', AuthMiddleware_1.AuthMiddleware.auth, PostControllers_1.PostControllers.deleteById);
exports.default = router;
