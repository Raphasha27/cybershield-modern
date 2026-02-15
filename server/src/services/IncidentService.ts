import { Incident } from '../models/Incident';
import { Alert } from '../models/Alert';
import { AuditLog } from '../models/AuditLog';

export class IncidentService {
  async createIncident(data: any, userId: string) {
    const incident = new Incident({ ...data, createdBy: userId });
    await incident.save();

    // Create alert for critical incidents
    if (data.severity === 'Critical') {
      await new Alert({
        type: 'Incident',
        title: `Critical Incident: ${data.title}`,
        message: data.description,
        severity: 'Critical',
        recipientId: userId,
        relatedResourceId: incident._id,
        isRead: false,
      }).save();
    }

    return incident;
  }

  async getIncident(id: string) {
    return await Incident.findById(id).populate('createdBy', 'name email').populate('assignedTo', 'name email');
  }

  async listIncidents(filters: any = {}, page = 1, limit = 20) {
    const query: any = {};
    if (filters.status) query.status = filters.status;
    if (filters.severity) query.severity = filters.severity;

    const skip = (page - 1) * limit;
    const incidents = await Incident.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    const total = await Incident.countDocuments(query);
    return { incidents, total, page, limit };
  }

  async updateIncident(id: string, data: any, userId: string) {
    const incident = await Incident.findById(id);
    if (!incident) throw new Error('Incident not found');

    const previousValues = { ...incident.toObject() };
    Object.assign(incident, data);

    if (data.status === 'Resolved') {
      incident.resolvedAt = new Date();
    }
    if (data.status === 'Closed') {
      incident.closedAt = new Date();
    }

    await incident.save();

    // Log audit
    await new AuditLog({
      userId,
      action: 'UPDATE_INCIDENT',
      resourceType: 'Incident',
      resourceId: incident._id,
      previousValues,
      newValues: incident.toObject(),
      ipAddress: '0.0.0.0',
      userAgent: 'API',
      status: 'Success',
    }).save();

    return incident;
  }

  async deleteIncident(id: string, userId: string) {
    const incident = await Incident.findByIdAndDelete(id);
    if (!incident) throw new Error('Incident not found');

    await new AuditLog({
      userId,
      action: 'DELETE_INCIDENT',
      resourceType: 'Incident',
      resourceId: id,
      ipAddress: '0.0.0.0',
      userAgent: 'API',
      status: 'Success',
    }).save();

    return incident;
  }
}

export const incidentService = new IncidentService();
