import User from '../models/users.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET, EXPIRES_IN } from '../config/env.js';


export const signup = async (req, res, next) => {
    try {
        const { userName, password } = req.body;

        const existingUser = await User.findOne({ userName: userName });
        if (existingUser) {
            const error = new Error("UserName already exists")
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ userName: userName, password: hashedPassword });

        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: EXPIRES_IN });
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUser
            }
        })
    } catch (error) {
        next(error)
    }
};

export const signin = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName: userName });

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            const error = new Error("Wrong password");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: EXPIRES_IN });
        res.status(200).json({
            success: true,
            message: "Signed in successfully",
            data: {
                token,
                user
            }
        })
    } catch (error) {
        next(error);
    }
};