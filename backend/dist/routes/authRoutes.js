"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var AuthControllers_1 = require("../controllers/AuthControllers");
var AuthMiddleware_1 = require("../middleware/AuthMiddleware");
var router = express_1.default.Router();
// @route /api/v1/auth/logged-in
// @desc - GET get current logged in use detials
// @access Private
router.get('/logged-in', AuthMiddleware_1.AuthMiddleware.auth, AuthControllers_1.AuthControllers.loggedInUser);
// @route /api/v1/auth/logout
// @desc - GET logout and delete user session
// @access Private
router.get('/logout', AuthMiddleware_1.AuthMiddleware.auth, AuthControllers_1.AuthControllers.logout);
// @route /api/v1/auth/login
// @desc - POST authenticate user and return access token
// @access Public
router.post('/login', AuthControllers_1.AuthControllers.login);
// @route /api/v1/auth/register
// @desc - POST create user and return access token
// @access Public
router.post('/register', AuthControllers_1.AuthControllers.register);
exports.default = router;
