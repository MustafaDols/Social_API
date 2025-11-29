"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = void 0;
const express_1 = require("express");
const Middlewares_1 = require("../../Middlewares");
const posts_service_1 = __importDefault(require("./Services/posts.service"));
const postController = (0, express_1.Router)();
exports.postController = postController;
// Add post
postController.post("/add", Middlewares_1.authentication, (0, Middlewares_1.Multer)().array("files", 3), posts_service_1.default.addPost);
// update post
// delete post
// get home posts
postController.get("/home", Middlewares_1.authentication, posts_service_1.default.listHomePosts);
