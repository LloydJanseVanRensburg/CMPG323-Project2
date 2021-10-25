"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var groupInviteSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    groupId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });
var GroupInvite = mongoose_1.default.model('GroupInvite', groupInviteSchema);
exports.default = GroupInvite;
