"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var PostControllers_1 = require("../controllers/PostControllers");
var router = express_1.default.Router();
router.get('/', PostControllers_1.PostControllers.getAll);
router.post('/', PostControllers_1.PostControllers.create);
router.get('/:postId', PostControllers_1.PostControllers.getById);
router.put('/:postId', PostControllers_1.PostControllers.updateById);
router.delete('/:postId', PostControllers_1.PostControllers.deleteById);
exports.default = router;
