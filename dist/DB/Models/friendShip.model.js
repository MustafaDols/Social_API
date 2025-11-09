"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendshipModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Common_1 = require("../../Common");
const friendshipSchema = new mongoose_1.default.Schema({
    requestFromId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    requestToId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: Common_1.FriendShipStatusEnum,
        default: Common_1.FriendShipStatusEnum.PENDING
    }
});
exports.FriendshipModel = mongoose_1.default.model('Friendship', friendshipSchema);
