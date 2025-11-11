"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationRepository = void 0;
const conversations_model_js_1 = require("../Models/conversations.model.js");
const base_repository_js_1 = require("./base.repository.js");
class ConversationRepository extends base_repository_js_1.BaseRepository {
    constructor() {
        super(conversations_model_js_1.conversationModel);
    }
}
exports.ConversationRepository = ConversationRepository;
