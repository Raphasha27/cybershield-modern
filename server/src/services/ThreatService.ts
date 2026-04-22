import { Threat } from '../models/Threat';
import { Alert } from '../models/Alert';

export class ThreatService {
  async createThreat(data: any) {
    const threat = new Threat(data);
    await threat.save();

    // Create alert for critical threats
    if (data.severity === 'Critical') {
      await new Alert({
        type: 'Threat',
        title: `Critical Threat: ${data.classification}`,
        message: data.description,
        severity: 'Critical',
        recipientId: '0',
        relatedResourceId: threat._id,
        isRead: false,
      }).save();
    }

    return threat;
  }

  async getThreat(id: string) {
    return await Threat.findById(id)
      .populate('investigatedBy', 'name email')
      .populate('relatedIncidents');
  }

  async listThreats(filters: any = {}) {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.severity) query.severity = filters.severity;

    return await Threat.find(query)
      .sort({ detectedAt: -1 })
      .populate('investigatedBy', 'name email')
      .populate('relatedIncidents');
  }

  async investigateThreat(id: string, notes: string, userId: string) {
    const threat = await Threat.findById(id);
    if (!threat) throw new Error('Threat not found');

    threat.status = 'Investigated';
    threat.investigatedAt = new Date();
    threat.investigatedBy = userId as any;
    threat.investigationNotes = notes;
    await threat.save();

    return threat;
  }
}

export const threatService = new ThreatService();
