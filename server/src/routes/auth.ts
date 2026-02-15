import { Router, Request, Response } from 'express';
import { authService } from '../services/AuthService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Email and password required' } });
    }

    const result = await authService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: error.message } });
  }
});

router.post('/logout', authMiddleware, (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } });
    }

    const user = await authService.createUser(email, name, password, 'Analyst');
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: error.message } });
  }
});

export default router;
