import mongoose, { Schema, Document } from 'mongoose';
import { Alert as IAlert } from '../types';

interface AlertDocument extends IAlert, Document {}

const alertSchema = new Schema<AlertDocument>(
  {
    type: { type: String, enum: ['Incident', 'Threat', 'System'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ['Critical', 'High', 'Medium', 'Low', 'Info'], required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    relatedResourceId: { type: Schema.Types.ObjectId, required: true },
    isRead: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    readAt: Date,
    archivedAt: Date,
  },
  { timestamps: true }
);

export const Alert = mongoose.model<AlertDocument>('Alert', alertSchema);
