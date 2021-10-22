"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var GroupControllers_1 = require("../controllers/GroupControllers");
var AuthMiddleware_1 = require("../middleware/AuthMiddleware");
var FileUploadMiddleware_1 = require("../middleware/FileUploadMiddleware");
var router = express_1.default.Router();
// @route /api/v1/groups
// @desc - GET get all groups
// @access Private
router.get('/', AuthMiddleware_1.AuthMiddleware.auth, GroupControllers_1.GroupControllers.getAll);
// @route /api/v1/groups
// @desc - POST create new group
// @access Private
router.post('/', AuthMiddleware_1.AuthMiddleware.auth, FileUploadMiddleware_1.upload.single('image'), GroupControllers_1.GroupControllers.create);
// @route /api/v1/groups/:groupId
// @desc - GET get group by id
// @access Private
router.get('/:groupId', AuthMiddleware_1.AuthMiddleware.auth, GroupControllers_1.GroupControllers.getById);
// @route /api/v1/groups/:groupId
// @desc - PUT update group by id
// @access Private
router.put('/:groupId', AuthMiddleware_1.AuthMiddleware.auth, FileUploadMiddleware_1.upload.single('image'), GroupControllers_1.GroupControllers.updateById);
// @route /api/v1/groups/:groupId
// @desc - DELETE remove group by id
// @access Private
router.delete('/:groupId', AuthMiddleware_1.AuthMiddleware.auth, GroupControllers_1.GroupControllers.deleteById);
// @route /api/v1/groups/:groupId/invite
// @desc - DELETE remove group by id
// @access Private
router.post('/:groupId/invite', AuthMiddleware_1.AuthMiddleware.auth, GroupControllers_1.GroupControllers.inviteToGroup);
exports.default = router;
