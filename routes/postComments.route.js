import { Router } from "express";
import authorization from "../middlewares/authorizition.middleware.js";
import { addComment, getPostComments } from "../controllers/comments.controller.js";
const postCommentsRouter = Router({ mergeParams: true });

postCommentsRouter.post("/", authorization, addComment);
postCommentsRouter.get("/", getPostComments);

export default postCommentsRouter;
