"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var groupSchema = new mongoose_1.default.Schema({
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    groupPicture: {
        type: String,
        required: true,
    },
    memberCount: {
        type: Number,
        required: true,
        default: 0,
    },
}, { timestamps: true });
var Group = mongoose_1.default.model('Group', groupSchema);
exports.default = Group;
