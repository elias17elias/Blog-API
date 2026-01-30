import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 1,
        maxlength: 150,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        minlength: [1, "Too short"],
        required: [true, "Content required"],
        trim: true,
    },
    tags: {
        type: [{ type: String, lowercase: true, trim: true, minlength: 1 }],
        default: [],
    },
    author: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ title: "text", content: "text" });
const Post = mongoose.model('Post', postSchema);
export default Post;