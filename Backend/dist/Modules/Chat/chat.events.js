"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEvents = void 0;
const chat_service_1 = require("./Services/chat.service");
class ChatEvents {
    constructor(socket) {
        this.socket = socket;
        this.chatService = new chat_service_1.ChatService();
    }
    sendPrivateMessageEvent() {
        this.socket.on("send-private-message", (data) => {
            this.chatService.sendPrivateMessage(this.socket, data);
        });
    }
    getCoversationMessagesEvent() {
        this.socket.on("get-conversation-messages", (data) => {
            this.chatService.getCoversationMessages(this.socket, data);
        });
    }
    sendGroupMessageEvent() {
        this.socket.on("send-group-message", (data) => {
            this.chatService.sendGroupMessage(this.socket, data);
        });
    }
    getGroupHistoryEvent() {
        this.socket.on("get-group-history", (data) => {
            this.chatService.getGroupHistory(this.socket, data);
        });
    }
}
exports.ChatEvents = ChatEvents;
