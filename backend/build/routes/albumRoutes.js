"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AlbumControllers_1 = require("../controllers/AlbumControllers");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const router = express_1.default.Router();
// @route   -   /api/v1/albums/group-albums
// @desc    -   POST fetch all albums for group
// @access  -   Private
router.post('/group-albums', AuthMiddleware_1.AuthMiddleware.auth, AlbumControllers_1.AlbumControllers.getAllGroupAlbums);
// @route   -   /api/v1/albums
// @desc    -   GET fetch all albums
// @access  -   Private
router.get('/', AuthMiddleware_1.AuthMiddleware.auth, AlbumControllers_1.AlbumControllers.getAll);
// @route   -   /api/v1/albums
// @desc    -   POST create new album
// @access  -   Private
router.post('/', AuthMiddleware_1.AuthMiddleware.auth, AlbumControllers_1.AlbumControllers.createAlbum);
// @route   -   /api/v1/albums/:albumId
// @desc    -   GET fetch album by id
// @access  -   Private
router.get('/:albumId', AuthMiddleware_1.AuthMiddleware.auth, AlbumControllers_1.AlbumControllers.getById);
// @route   -   /api/v1/albums/:albumId
// @desc    -   PUT update album by id
// @access  -   Private
router.put('/:albumId', AuthMiddleware_1.AuthMiddleware.auth, AlbumControllers_1.AlbumControllers.updateById);
// @route   -   /api/v1/albums/:albumId
// @desc    -   DELETE remove album by id
// @access  -   Private
router.delete('/:albumId', AuthMiddleware_1.AuthMiddleware.auth, AlbumControllers_1.AlbumControllers.deleteById);
exports.default = router;
