"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserControllers_1 = require("../controllers/UserControllers");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const router = express_1.default.Router();
// @route   -   /api/v1/users
// @desc    -   GET fetch all users
// @access  -   Private
router.get('/', AuthMiddleware_1.AuthMiddleware.auth, UserControllers_1.UserControllers.getAll);
// @route   -   /api/v1/users/:userId
// @desc    -   GET fetch user by id
// @access  -   Private
router.get('/:userId', AuthMiddleware_1.AuthMiddleware.auth, UserControllers_1.UserControllers.getById);
// @route   -   /api/v1/users/:userId
// @desc    -   DELETE remove user by id
// @access  -   Private
router.delete('/:userId', AuthMiddleware_1.AuthMiddleware.auth, UserControllers_1.UserControllers.deleteById);
exports.default = router;
