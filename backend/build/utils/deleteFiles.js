"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlinkFile = void 0;
// Core Node
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
exports.unlinkFile = util_1.default.promisify(fs_1.default.unlink);
