import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { dashboardService } from '../services/DashboardService';

const router = Router();

router.get('/metrics', authMiddleware, async (req: Request, res: Response) => {
  try {
    const metrics = await dashboardService.getMetrics(req.user!.userId);
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;
