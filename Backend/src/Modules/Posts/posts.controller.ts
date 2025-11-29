import { Router } from "express";
import { authentication , Multer } from "../../Middlewares"
import postService from "./Services/posts.service"
const postController = Router();

// Add post
postController.post("/add",authentication, Multer().array("files" , 3), postService.addPost)

// update post

// delete post

// get home posts
postController.get("/home",authentication, postService.listHomePosts)

// get post by id

// get all posts for specific user

export { postController }


