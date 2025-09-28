import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import * as controllers from "./Modules/controllers.index";
import { dbConnection } from "./DB/db.connection";
const app = express();

app.use(express.json());

dbConnection();
 
app.use("/api/auth", controllers.authController)
app.use("/api/users", controllers.profileController)
app.use("/api/posts", controllers.postController)
app.use("/api/comments", controllers.commentsController)
app.use("/api/reacts", controllers.reactsController)

//Error Handling Middleware
app.use((err: Error | null, req: Request, res: Response, next: NextFunction) => {
    const status = 500
    const message = "Something went wrong"
    res.status(status).json({ message: err?.message || message })
})

// Start server
const port: number | string = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
});
 