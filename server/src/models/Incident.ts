import mongoose, { Schema, Document } from 'mongoose';
import { Incident as IIncident } from '../types';

interface IncidentDocument extends IIncident, Document {}

const incidentSchema = new Schema<IncidentDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, enum: ['Critical', 'High', 'Medium', 'Low', 'Info'], required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
    type: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: Date,
    closedAt: Date,
    tags: [String],
  },
  { timestamps: true }
);

export const Incident = mongoose.model<IncidentDocument>('Incident', incidentSchema);
