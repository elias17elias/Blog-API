import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "UserName is required"],
        minlength: 3,
        maxlength: 100,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        trim: true,
    }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
export default User;