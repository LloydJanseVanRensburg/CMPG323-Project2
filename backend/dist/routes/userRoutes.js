"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var UserControllers_1 = require("../controllers/UserControllers");
var router = express_1.default.Router();
router.get('/', UserControllers_1.UserControllers.getAll);
router.get('/:userId', UserControllers_1.UserControllers.getById);
router.put('/:userId', UserControllers_1.UserControllers.updateById);
router.delete('/:userId', UserControllers_1.UserControllers.deleteById);
exports.default = router;
