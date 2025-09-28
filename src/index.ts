import "dotenv/config";
import express from "express";
import * as controllers from "./Modules/controllers.index";
const app = express();

app.use(express.json());

app.use("/api/auth",controllers.authController) 
app.use("/api/users", controllers.profileController)
app.use("/api/posts", controllers.postController)
app.use("/api/comments", controllers.commentsController)
app.use("/api/reacts", controllers.reactsController) 

// Start server
const port : number | string = process.env.PORT || 5000;
app.listen(port, () => { 
    console.log(`Server running on port : ${port}`);
});
 