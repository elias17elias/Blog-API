import { Router } from "express";
import { createPost, deletePost, editPost, filter, getPost, getPosts, getUserPosts, search } from "../controllers/posts.controller.js";
import authorization from '../middlewares/authorizition.middleware.js'
import postCommentsRouter from "./postComments.route.js";
const postsRouter = Router();

postsRouter.post("/", authorization, createPost);
postsRouter.get("/", getPosts);
postsRouter.get("/search", search);
postsRouter.get("/filter", filter);
postsRouter.get("/:id", getPost);
postsRouter.patch("/:id", authorization, editPost);
postsRouter.delete("/:id", authorization, deletePost);
postsRouter.get("/user/:id", getUserPosts);

postsRouter.use("/:id/comments", postCommentsRouter);
export default postsRouter;