"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthControllers_1 = require("../controllers/AuthControllers");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const router = express_1.default.Router();
// @route   -   /api/v1/auth/logged-in
// @desc    -   GET fetch currently logged in user data
// @access  -   Private
router.get('/logged-in', AuthMiddleware_1.AuthMiddleware.auth, AuthControllers_1.AuthControllers.loggedInUser);
// @route   -   /api/v1/auth/login
// @desc    -   POST authenticate user and send token
// @access  -   Public
router.post('/login', AuthControllers_1.AuthControllers.login);
// @route   -   /api/v1/auth/register
// @desc    -   POST register users, authenticate and send token
// @access  -   Public
router.post('/register', AuthControllers_1.AuthControllers.register);
exports.default = router;
