import Comment from '../models/comments.model.js';
import Post from '../models/posts.model.js';

export const addComment = async (req, res, next) => {
    try {
        if (!await Post.exists({ _id: req.params.id })) {
            const error = new Error("post not found");
            error.statusCode = 404;
            throw error;
        }
        const { content } = req.body;
        const newComment = await Comment.create({ content, user: req.user.id, post: req.params.id });
        res.status(201).json({ success: true, message: "Comment added successfully", data: newComment });
    } catch (error) {
        next(error);
    }
};

export const getPostComments = async (req, res, next) => {
    try {
        if (!await Post.exists({ _id: req.params.id })) {
            const error = new Error("post not found");
            error.statusCode = 404;
            throw error;
        }
        const limit = 10;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const skip = (page - 1) * limit;
        const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: -1 })
            .skip(skip).limit(limit).populate("user", "userName");
        const total = await Comment.countDocuments({ post: req.params.id });
        const pages = Math.ceil(total / limit);
        const hasNext = pages > page;
        const hasPrevious = page > 1;
        
        res.status(200).json({
            success: true,
            data: {
                page,
                comments,
                pages,
                total,
                hasNext,
                hasPrevious
            }
        });
    } catch (error) {
        next(error);
    }
};

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            const error = new Error("comment not found");
            error.statusCode = 404;
            throw error;
        }
        if (comment.user != req.user.id) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }
        if (req.body.content !== undefined)
            comment.content = req.body.content
        await comment.save();
        res.status(200).json({ success: true, data: comment });
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const deleted = await Comment.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Comment not found or access denied" });
        }
        res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        next(error)
    }
};