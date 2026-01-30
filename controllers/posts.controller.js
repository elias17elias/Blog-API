import Post from '../models/posts.model.js';
import Comment from '../models/comments.model.js';
import mongoose from 'mongoose';

export const createPost = async (req, res, next) => {
    try {
        const tags = Array.from(new Set((req.body.tags || []).map(v => v.trim().toLowerCase()).filter(Boolean)));
        const { content, title } = req.body;
        const newPost = await Post.create({ title, content, tags, author: req.user.id });
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: newPost
        });
    } catch (error) {
        next(error);
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const limit = 10;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const skip = (page - 1) * limit;
        const posts = await Post.find().sort({ createdAt: -1 })
            .skip(skip).limit(limit).populate("author", "userName");
        const total = await Post.countDocuments();
        const pages = Math.ceil(total / limit);
        const hasPrevious = page > 1;
        const hasNext = pages > page;

        res.status(200).json({
            success: true,
            data: {
                page,
                posts,
                pages,
                total,
                hasNext,
                hasPrevious
            }
        })
    } catch (error) {
        next(error)
    }
};

export const getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "userName");
        if (!post) {
            const error = new Error("post not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        next(error);
    }
};

export const getUserPosts = async (req, res, next) => {
    try {
        const limit = 10;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const skip = (page - 1) * limit;
        const posts = await Post.find({ author: req.params.id }).sort({ createdAt: -1 })
            .skip(skip).limit(limit).populate("author", "userName");
        const total = await Post.countDocuments({ author: req.params.id });
        const pages = Math.ceil(total / limit);
        const hasNext = pages > page;
        const hasPrevious = page > 1;

        res.status(200).json({
            success: true,
            data: {
                page,
                posts,
                pages,
                total,
                hasNext,
                hasPrevious
            }
        })
    } catch (error) {
        next(error);
    }
};

export const editPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 404;
            throw error;
        }

        if (post.author!=req.user.id) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }

        const { title, content } = req.body;

        if (title !== undefined) post.title = title;
        if (content !== undefined) post.content = content;

        if (req.body.tags !== undefined) {
            const tags = Array.from(
                new Set((req.body.tags || []).map(v => v.trim().toLowerCase()).filter(Boolean))
            );
            post.tags = tags;
        }

        await post.save();

        res.status(200).json({ success: true, message: "Post updated successfully", data: post });
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const deleted = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id },{session});
        if (!deleted) {
            const error = new Error("Post not found or access denied");
            error.statusCode = 404;
            throw error;
        }
        await Comment.deleteMany({ post: deleted._id }).session(session);
        await session.commitTransaction();
        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        next(error)
    } finally { session.endSession(); }
};

export const search = async (req, res, next) => {
    try {
        const q = req.query.q?.trim();
        if (!q) {
            const error = new Error("q is required");
            error.statusCode = 400;
            throw error;
        }
        const author = req.query.author;
        const tags = req.query.tags ? req.query.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];

        const filter = {
            $text: { $search: q }
        }
        if (author) filter.author = author;
        if (tags.length) filter.tags = { $in: tags };

        const sort = req.query.sort || 'newest';
        const projection = sort === 'relevance' ? { score: { $meta: "textScore" } } : {};

        const limit = 10;
        const page =Math.max( Number(req.query.page) || 1,1);
        const skip = (page - 1) * limit;

        let query = Post.find(filter, projection).populate("author", "userName");
        if (sort === 'relevance') {
            query = query.sort({ score: { $meta: "textScore" } });
        }
        else {
            query = query.sort({ createdAt: -1 });
        }
        const posts = await query.skip(skip).limit(limit);
        const total = await Post.countDocuments(filter);
        const pages = Math.ceil(total / limit);
        const hasPrevious = page > 1;
        const hasNext = pages > page;

        res.status(200).json({
            success: true,
            data: {
                page,
                posts,
                pages,
                total,
                hasNext,
                hasPrevious
            }
        })
    } catch (error) {
        next(error);
    }
};

export const filter = async (req, res, next) => {
    try {
        const author = req.query.author;
        const tags = req.query.tags ? req.query.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];
        if (!(author || tags.length)) {
            const error = new Error("author or tags required");
            error.statusCode = 400;
            throw error;
        }
        const filter = {};
        if (tags.length) filter.tags = {
            $all: tags
        };
        if (author) filter.author = author;
        const limit = 10;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const skip = (page - 1) * limit;

        const posts = await Post.find(filter).populate("author", "userName").sort({ createdAt: -1 }).skip(skip).limit(limit);
        const total = await Post.countDocuments(filter);
        const pages = Math.ceil(total / limit);
        const hasPrevious = page > 1;
        const hasNext = pages > page;

        res.status(200).json({
            success: true,
            data: {
                page,
                posts,
                pages,
                total,
                hasNext,
                hasPrevious
            }
        })
    } catch (error) {
        next(error);
    }
};