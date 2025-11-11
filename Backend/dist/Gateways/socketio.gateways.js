"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.ioIntializer = exports.connectedSockets = void 0;
const socket_io_1 = require("socket.io");
const Utils_1 = require("../Utils/");
const chat_1 = require("../Modules/Chat/chat");
exports.connectedSockets = new Map(); // key: userId, value: socketId[]
let io = null;
function socketAuthentication(socket, next) {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Authentication error: Token not provided"));
    }
    try {
        const decodedData = (0, Utils_1.verifyToken)(token, process.env.JWT_ACCESS_SECRET);
        socket.data = { userId: decodedData._id };
        const userTabs = exports.connectedSockets.get(socket.data.userId);
        if (!userTabs)
            exports.connectedSockets.set(socket.data.userId, [socket.id]);
        else
            userTabs.push(socket.id);
        socket.emit('connected', { user: { _id: socket.data.userId, firstName: decodedData.firstName, lastName: decodedData.lastName } });
        next();
    }
    catch (error) {
        next(new Error("Authentication error: Invalid token"));
    }
}
function socketDisconnection(socket) {
    socket.on('disconnect', () => {
        const userId = socket.data.userId;
        let userTabs = exports.connectedSockets.get(userId);
        if (userTabs && userTabs.length) {
            userTabs = userTabs.filter((tab) => tab !== socket.id);
            if (!userTabs.length)
                exports.connectedSockets.delete(userId);
        }
        socket.broadcast.emit('disconnect_user', { userId, socketId: socket.id });
    });
}
const ioIntializer = (server) => {
    io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    // socket middleware
    io.use(socketAuthentication);
    io.on("connection", (socket) => {
        (0, chat_1.ChatInitiation)(socket);
        socketDisconnection(socket);
    });
};
exports.ioIntializer = ioIntializer;
const getIo = () => {
    try {
        if (!io) {
            throw new Error("Socket.io is not initialized");
        }
    }
    catch (error) {
        console.log(error);
    }
    return io;
};
exports.getIo = getIo;
