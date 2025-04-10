import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid, email, password } = req.body;

        const existingUserByUid = await UserModel.findByUid(uid);
        if (existingUserByUid) {
            res.status(400).json({ message: 'UID already exists' });
            return;
        }

        const existingUserByEmail = await UserModel.findByEmail(email);
        if (existingUserByEmail) {
            res.status(400).json({ message: 'Email already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await UserModel.createUser({
            uid,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid, password } = req.body;

        const user = await UserModel.findByUid(uid);
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, uid: user.uid },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
