"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var groupMemberSchema = new mongoose_1.default.Schema({
    memberId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    groupId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
}, { timestamps: true });
var GroupMember = mongoose_1.default.model('GroupMember', groupMemberSchema);
exports.default = GroupMember;
