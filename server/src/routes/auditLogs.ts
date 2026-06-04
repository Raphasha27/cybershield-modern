import { Router, Request, Response } from 'express';
import { AuditLog } from '../models/AuditLog';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Middleware to check if user is Admin
const adminMiddleware = (req: Request, res: Response, next: any) => {
  if ((req as any).user.role !== 'Admin') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Admin access required' } });
  }
  next();
};

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email');

    const total = await AuditLog.countDocuments();

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;
