import { Router } from "express";
import { deleteUser, getUser } from "../controllers/users.controller.js";
import authorization from '../middlewares/authorizition.middleware.js';
const usersRouter = Router();

usersRouter.get("/:id", getUser);
usersRouter.delete("/:id", authorization, deleteUser);

export default usersRouter;