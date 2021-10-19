"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var GroupControllers_1 = require("../controllers/GroupControllers");
var router = express_1.default.Router();
router.get('/', GroupControllers_1.GroupControllers.getAll);
router.post('/', GroupControllers_1.GroupControllers.create);
router.get('/:groupId', GroupControllers_1.GroupControllers.getById);
router.put('/:groupId', GroupControllers_1.GroupControllers.updateById);
router.delete('/:groupId', GroupControllers_1.GroupControllers.deleteById);
exports.default = router;
