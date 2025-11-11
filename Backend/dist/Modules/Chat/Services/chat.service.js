"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const socketio_gateways_js_1 = require("../../../Gateways/socketio.gateways.js");
const Repositories_1 = require("../../../DB/Repositories");
class ChatService {
    constructor() {
        this.conversationRepository = new Repositories_1.ConversationRepository();
        this.messageRepository = new Repositories_1.MessageRepository();
    }
    async joinprivateChat(socket, targerUserId) {
        let convesation = await this.conversationRepository.findOneDocument({
            type: "direct",
            members: { $all: [socket.data.userId, targerUserId] },
        });
        if (!convesation) {
            convesation = await this.conversationRepository.createNewDocument({
                type: "direct",
                members: [socket.data.userId, targerUserId],
            });
        }
        socket.join(convesation._id.toString());
        return convesation;
    }
    async sendPrivateMessage(socket, data) {
        const { text, targerUserId } = data;
        const coversation = await this.joinprivateChat(socket, targerUserId);
        // create message
        const message = await this.messageRepository.createNewDocument({
            text,
            conversationId: coversation._id,
            senderId: socket.data.userId,
        });
        (0, socketio_gateways_js_1.getIo)()?.to(coversation._id.toString()).emit("message-sent", message);
    }
    async getCoversationMessages(socket, targeterUserId) {
        const conversation = await this.joinprivateChat(socket, targeterUserId);
        const messages = await this.messageRepository.findDocuments({ conversationId: conversation._id });
        socket.emit('Conversation messages', messages);
    }
    async joinChatGroup(socket, targetGroupId) {
        let conversation = await this.conversationRepository.findOneDocument({
            _id: targetGroupId,
            type: 'group'
        });
        socket.join(conversation?._id?.toString() || "");
        return conversation;
    }
    async sendGroupMessage(socket, data) {
        const { text, targetGroupId } = data;
        const conversation = await this.joinChatGroup(socket, targetGroupId);
        // creat message
        const message = await this.messageRepository.createNewDocument({
            text,
            conversationId: conversation?._id,
            senderId: socket.data.userId
        });
        (0, socketio_gateways_js_1.getIo)()?.to(conversation?._id?.toString() || "").emit('message-sent', message);
    }
    async getGroupHistory(socket, targetGroupId) {
        const messages = await this.messageRepository.findDocuments({
            conversationId: targetGroupId
        });
        socket.emit('chat history', messages);
    }
}
exports.ChatService = ChatService;
