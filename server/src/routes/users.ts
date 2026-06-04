import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import { authMiddleware } from '../middleware/auth';
import { authService } from '../services/AuthService';

const router = Router();

// Middleware to check if user is Admin
const adminMiddleware = (req: Request, res: Response, next: any) => {
  if ((req as any).user.role !== 'Admin') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Admin access required' } });
  }
  next();
};

// Apply auth and admin middleware to all user routes
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find({ status: { $ne: 'Deleted' } }).select('-passwordHash');
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, name, password, role } = req.body;
    if (!email || !name || !password || !role) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } });
    }
    const user = await authService.createUser(email, name, password, role);
    res.status(201).json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: error.message } });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
    
    user.status = 'Deleted';
    user.deletedAt = new Date();
    await user.save();
    res.json({ success: true, message: 'User deleted' });
  } catch (error: any) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;
