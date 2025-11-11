"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const messages_model_js_1 = require("../Models/messages.model.js");
const base_repository_js_1 = require("./base.repository.js");
class MessageRepository extends base_repository_js_1.BaseRepository {
    constructor() {
        super(messages_model_js_1.messageModel);
    }
}
exports.MessageRepository = MessageRepository;
