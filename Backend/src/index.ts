import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";

import * as controllers from "./Modules/controllers.index";
import { dbConnection } from "./DB/db.connection";
import { HttpException, FailedResponse } from "./Utils";
import { ioIntializer } from "./Gateways/socketio.gateways";


// Server setup
const app = express();

// Middleware 
app.use(cors())
app.use(express.json())

// create a write stream (in append mode) 
var accessLogStream = fs.createWriteStream("access.log")
// setup the logger
app.use(morgan("dev", { stream: accessLogStream }))

// DB Connection
dbConnection()

// Routes
app.use("/api/auth", controllers.authController)
app.use("/api/users", controllers.profileController)
app.use("/api/posts", controllers.postController)
app.use("/api/comments", controllers.commentsController)
app.use("/api/reacts", controllers.reactsController)

//Error Handling Middleware
app.use((err: HttpException | Error | null, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        if (err instanceof HttpException) {
            return res.status(err.statusCode).json(FailedResponse(err.message, err.statusCode, err.error))
        } else {
            res.status(500).json(FailedResponse(err.message, 500, err))
        }
    }
})

// Unhandled Rejection
process.on("unhandledRejection", (reason, promise) => {
    console.error(" Unhandled Rejection:", reason);
});
// Uncaught Exception
process.on("uncaughtException", (err) => {
    console.error(" Uncaught Exception:", err);
});

// Start server 
const port: number | string = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
})

// Socket.io 
ioIntializer(server)

