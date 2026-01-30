import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        minlength: [1,"Too short"],
        required: [true,"Content required"],
        trim: true,
    },
    post: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Post',
        required: true,
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required: true,
    }
}, { timestamps: true });
commentSchema.index({ post: 1, createdAt: -1 });
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;