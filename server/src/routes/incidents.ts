import { Router, Request, Response } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { incidentService } from '../services/IncidentService';

const router = Router();

router.post('/', authMiddleware, requireRole(['Admin', 'Analyst']), async (req: Request, res: Response) => {
  try {
    const incident = await incidentService.createIncident(req.body, req.user!.userId);
    res.status(201).json(incident);
  } catch (error: any) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: error.message } });
  }
});

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await incidentService.listIncidents(req.query, page, limit);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const incident = await incidentService.getIncident(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Incident not found' } });
    }
    res.json(incident);
  } catch (error: any) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

router.put('/:id', authMiddleware, requireRole(['Admin', 'Analyst']), async (req: Request, res: Response) => {
  try {
    const incident = await incidentService.updateIncident(req.params.id, req.body, req.user!.userId);
    res.json(incident);
  } catch (error: any) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: error.message } });
  }
});

router.delete('/:id', authMiddleware, requireRole(['Admin', 'Analyst']), async (req: Request, res: Response) => {
  try {
    await incidentService.deleteIncident(req.params.id, req.user!.userId);
    res.json({ message: 'Incident deleted' });
  } catch (error: any) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: error.message } });
  }
});

export default router;
