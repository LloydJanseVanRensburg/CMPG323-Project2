"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GroupControllers_1 = require("../controllers/GroupControllers");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const FileUploadMiddleware_1 = require("../middleware/FileUploadMiddleware");
const router = express_1.default.Router();
// @route   -   /api/v1/groups
// @desc    -   POST upload group profile picture to AWS S3
// @access  -   Private
router.post('/upload', AuthMiddleware_1.AuthMiddleware.auth, FileUploadMiddleware_1.upload.single('image'), GroupControllers_1.GroupControllers.uploadProfile);
// @route   -   /api/v1/groups
// @desc    -   GET fetch all groups
// @access  -   Private
router.get('/', AuthMiddleware_1.AuthMiddleware.auth, GroupControllers_1.GroupControllers.getAll);
// @route   -   /api/v1/groups
// @desc    -   POST create new group
// @access  -   Private
router.post('/', AuthMiddleware_1.AuthMiddleware.auth, GroupControllers_1.GroupControllers.create);
// @route   -   /api/v1/groups/:groupId
// @desc    -   GET fetch group by id
// @access  -   Private
router.get('/:groupId', AuthMiddleware_1.AuthMiddleware.auth, GroupControllers_1.GroupControllers.getById);
// @route   -   /api/v1/groups/:groupId
// @desc    -   PUT update group by id
// @access  -   Private
router.put('/:groupId', AuthMiddleware_1.AuthMiddleware.auth, GroupControllers_1.GroupControllers.updateById);
// @route   -   /api/v1/groups/:groupId
// @desc    -   DELETE remove group by id
// @access  -   Private
router.delete('/:groupId', AuthMiddleware_1.AuthMiddleware.auth, GroupControllers_1.GroupControllers.deleteById);
// @route   -   /api/v1/groups/:groupId/invite
// @desc    -   POST send invite to group of emails
// @access  -   Private
router.post('/:groupId/invite', AuthMiddleware_1.AuthMiddleware.auth, GroupControllers_1.GroupControllers.inviteToGroup);
// @route   -   /api/v1/groups/:groupId/join
// @desc    -   POST join group from
// @access  -   Public
router.post('/:groupId/join', GroupControllers_1.GroupControllers.joinGroup);
// @route   -   /api/v1/groups/:groupId/leave
// @desc    -   DELETE remove user from group
// @access  -   Private
router.delete('/:groupId/leave', AuthMiddleware_1.AuthMiddleware.auth, GroupControllers_1.GroupControllers.leaveGroup);
exports.default = router;
