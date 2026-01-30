import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import postsRouter from './routes/posts.route.js';
import usersRouter from './routes/users.route.js';
import { PORT } from './config/env.js';
import connectToDatabase from './database/db.js';
import errormiddleware from './middlewares/error.middleware.js';
import commentsRouter from './routes/comments.route.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v2/users", usersRouter);
app.use("/api/v2/posts", postsRouter);
app.use("/api/v2/comments", commentsRouter);

app.use(errormiddleware);

app.listen(PORT,async () => {
    console.log(`server is running on http://localhost:${PORT}`);
    await connectToDatabase();
})

export default app;
