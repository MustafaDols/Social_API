"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatInitiation = void 0;
const chat_events_js_1 = require("./chat.events.js");
const ChatInitiation = (socket) => {
    const chatEvents = new chat_events_js_1.ChatEvents(socket);
    chatEvents.sendPrivateMessageEvent();
    chatEvents.getCoversationMessagesEvent();
    chatEvents.getGroupHistoryEvent();
    chatEvents.sendGroupMessageEvent();
};
exports.ChatInitiation = ChatInitiation;
