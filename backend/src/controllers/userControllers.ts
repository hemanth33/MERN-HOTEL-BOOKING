import { Request, Response } from 'express';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';

export const registerController = async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            message: errors.array()
        })
    }

    try {
        let user = await User.findOne({
            email: req.body.email,
        });

        if(user) {
            return res.status(400).send({
                message: "User already exists",
            });
        } 

        user = new User(req.body);
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 86400000,
        });

        return res.status(200).send({
            message: "User successfully registered.",
        });

    } catch (error) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
}

export const getUserController = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password");

        if(!user) {
            return res.status(400).send({
                message: "user not found"
            });
        }

        res.json(user);
        
    } catch (error) {
        res.status(500).send({
            message: "Cannot get user"
        })
    }
}