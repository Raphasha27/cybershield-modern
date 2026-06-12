import { Router, Request, Response } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { threatService } from '../services/ThreatService';
import { aiThreatService } from '../services/aiThreatService';
import { copilotService } from '../services/copilotService';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const threats = await threatService.listThreats(req.query);
    res.json(threats);
  } catch (error: any) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

router.post('/analyze-logs', authMiddleware, requireRole(['Admin', 'Analyst']), async (req: Request, res: Response) => {
  try {
    const { logs, source } = req.body;
    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Logs array is required' } });
    }
    const analysis = await aiThreatService.analyzeLogs(logs);
    
    let threat = null;
    if (analysis.isAnomaly) {
      threat = await threatService.createThreat({
        classification: 'AI Detected Anomaly',
        description: `${analysis.explanation} | Playbook: ${analysis.mitigationPlaybook}`,
        severity: analysis.threatScore > 80 ? 'Critical' : analysis.threatScore > 50 ? 'High' : 'Medium',
        status: 'Active',
        detectedAt: new Date(),
        detectionSource: source || 'AI Log Analyzer'
      });
    }

    res.json({ analysis, threat });
  } catch (error: any) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

router.post('/copilot', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Question is required' } });
    }
    const answer = await copilotService.queryCopilot(question);
    res.json({ answer });
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

