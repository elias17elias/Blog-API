import User from '../models/users.model.js';
import Post from '../models/posts.model.js';
import Comment from '../models/comments.model.js';
import mongoose from 'mongoose';

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        if (req.user.id != req.params.id) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }
        const deleted = await User.findByIdAndDelete(req.user.id,{session});
        if (!deleted) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        await Post.deleteMany({ author: deleted._id }).session(session);
        await Comment.deleteMany({ user: deleted._id }).session(session);
        await session.commitTransaction();
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally { session.endSession(); }
};