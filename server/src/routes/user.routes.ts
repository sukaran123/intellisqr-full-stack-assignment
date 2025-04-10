import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Fix this line:
router.get('/profile', authMiddleware, (req: any, res) => {
    res.json({ user: req.user });
  // Don't return the response
});

export default router;