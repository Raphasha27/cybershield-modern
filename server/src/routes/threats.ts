import { Router, Request, Response } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { threatService } from '../services/ThreatService';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const threats = await threatService.listThreats(req.query);
    res.json(threats);
  } catch (error: any) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const threat = await threatService.getThreat(req.params.id);
    if (!threat) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Threat not found' } });
    }
    res.json(threat);
  } catch (error: any) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

router.put('/:id/investigate', authMiddleware, requireRole(['Admin', 'Analyst']), async (req: Request, res: Response) => {
  try {
    const threat = await threatService.investigateThreat(req.params.id, req.body.notes, req.user!.userId);
    res.json(threat);
  } catch (error: any) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: error.message } });
  }
});

export default router;
