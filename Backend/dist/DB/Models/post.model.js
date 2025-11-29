"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const postSchema = new mongoose_1.default.Schema({
    description: String,
    attachments: [String],
    ownerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    tags: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});
postSchema.plugin(mongoose_paginate_v2_1.default);
exports.PostModel = mongoose_1.default.model('Post', postSchema);
