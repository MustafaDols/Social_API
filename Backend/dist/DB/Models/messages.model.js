"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    text: String,
    conversationId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "conversations",
        required: true,
    },
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    attachments: [String],
}, { timestamps: true });
exports.messageModel = mongoose_1.default.model("Messages", messageSchema);
