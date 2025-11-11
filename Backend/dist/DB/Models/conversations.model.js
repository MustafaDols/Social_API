"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationModel = void 0;
const mongoose_1 = require("mongoose");
const conversationSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["direct", "group"],
        default: "direct",
    },
    name: {
        type: String,
        required: false,
    },
    members: [
        {
            type: mongoose_1.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true });
exports.conversationModel = (0, mongoose_1.model)("Conversation", conversationSchema);
