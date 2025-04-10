import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: JwtPayload; // or you can use a custom type like { id: string, uid: string }
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'No token, authorization denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

        if (typeof decoded === 'object') {
            req.user = decoded;
            next();
        } else {
            res.status(401).json({ message: 'Invalid token payload' });
        }
    } catch (error) {
        console.error('JWT Error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
