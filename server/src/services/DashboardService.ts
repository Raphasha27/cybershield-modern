import { Incident } from '../models/Incident';
import { Threat } from '../models/Threat';
import { Alert } from '../models/Alert';
import { DashboardMetrics } from '../types';

export class DashboardService {
  async getMetrics(userId: string): Promise<DashboardMetrics> {
    const incidents = await Incident.find();
    const threats = await Threat.find({ status: 'Active' });
    const recentIncidents = await Incident.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    const recentAlerts = await Alert.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const incidentsByStatus = {
      open: incidents.filter((i) => i.status === 'Open').length,
      inProgress: incidents.filter((i) => i.status === 'In Progress').length,
      resolved: incidents.filter((i) => i.status === 'Resolved').length,
      closed: incidents.filter((i) => i.status === 'Closed').length,
    };

    const incidentsBySeverity = {
      critical: incidents.filter((i) => i.severity === 'Critical').length,
      high: incidents.filter((i) => i.severity === 'High').length,
      medium: incidents.filter((i) => i.severity === 'Medium').length,
      low: incidents.filter((i) => i.severity === 'Low').length,
      info: incidents.filter((i) => i.severity === 'Info').length,
    };

    return {
      totalIncidents: incidents.length,
      incidentsByStatus,
      incidentsBySeverity,
      activeThreats: threats.length,
      recentIncidents,
      recentAlerts,
    };
  }
}

export const dashboardService = new DashboardService();
