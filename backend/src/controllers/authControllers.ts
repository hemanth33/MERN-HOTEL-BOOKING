import { validationResult } from "express-validator";
import User from "../models/userModel";
import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginController = async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).send({
            message: errors.array(),
        });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({
                message: "Invalid Credentials",
            });
        }

        const isPassword = await bcryptjs.compare(password, user.password);
        if(!isPassword) {
            return res.status(400).send({
                message: "Invalid Credentials",
            });
        }

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: '1d' }
        );

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000,
        });

        res.status(200).send({
            userId: user._id
        });

    } catch (error) {
        res.status(500).send({
            message: "Something went wrong",
        });
    }
}

export const validateTokenController = async (req: Request, res: Response) => {
    res.status(200).send({
        userId: req.userId,
    });
}

export const logOutController = async (req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0),
    });

    res.send();
}