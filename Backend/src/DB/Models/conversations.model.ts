import mongoose, { Schema, Types, model } from "mongoose";
import type { IConversation } from "../../Common/index.js";

const conversationSchema = new Schema<IConversation>(
    {
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
                type: Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

export const conversationModel = model<IConversation>(
    "Conversation",
    conversationSchema
);