"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const fs_1 = __importDefault(require("fs"));
const controllers = __importStar(require("./Modules/controllers.index"));
const db_connection_1 = require("./DB/db.connection");
const Utils_1 = require("./Utils");
const socketio_gateways_1 = require("./Gateways/socketio.gateways");
// Server setup
const app = (0, express_1.default)();
// Middleware 
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// create a write stream (in append mode) 
var accessLogStream = fs_1.default.createWriteStream("access.log");
// setup the logger
app.use((0, morgan_1.default)("dev", { stream: accessLogStream }));
// DB Connection
(0, db_connection_1.dbConnection)();
// Routes
app.use("/api/auth", controllers.authController);
app.use("/api/users", controllers.profileController);
app.use("/api/posts", controllers.postController);
app.use("/api/comments", controllers.commentsController);
app.use("/api/reacts", controllers.reactsController);
//Error Handling Middleware
app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof Utils_1.HttpException) {
            return res.status(err.statusCode).json((0, Utils_1.FailedResponse)(err.message, err.statusCode, err.error));
        }
        else {
            res.status(500).json((0, Utils_1.FailedResponse)(err.message, 500, err));
        }
    }
});
// Unhandled Rejection
process.on("unhandledRejection", (reason, promise) => {
    console.error(" Unhandled Rejection:", reason);
});
// Uncaught Exception
process.on("uncaughtException", (err) => {
    console.error(" Uncaught Exception:", err);
});
// Start server 
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
// Socket.io 
(0, socketio_gateways_1.ioIntializer)(server);
