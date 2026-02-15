import mongoose, { Schema, Document } from 'mongoose';
import { Threat as IThreat } from '../types';

interface ThreatDocument extends IThreat, Document {}

const threatSchema = new Schema<ThreatDocument>(
  {
    classification: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, enum: ['Critical', 'High', 'Medium', 'Low', 'Info'], required: true },
    status: { type: String, enum: ['Active', 'Investigated', 'Resolved'], default: 'Active' },
    detectedAt: { type: Date, required: true },
    detectionSource: { type: String, required: true },
    investigatedAt: Date,
    investigatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    investigationNotes: String,
    relatedIncidents: [{ type: Schema.Types.ObjectId, ref: 'Incident' }],
  },
  { timestamps: true }
);

export const Threat = mongoose.model<ThreatDocument>('Threat', threatSchema);
