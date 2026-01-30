import { Router } from "express";
import { deleteComment, editComment } from "../controllers/comments.controller.js";
import authorization from '../middlewares/authorizition.middleware.js'
const commentsRouter = Router();

commentsRouter.patch("/:id", authorization, editComment);
commentsRouter.delete("/:id", authorization, deleteComment);

export default commentsRouter;