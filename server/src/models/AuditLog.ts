import mongoose, { Schema, Document } from 'mongoose';
import { AuditLog as IAuditLog } from '../types';

interface AuditLogDocument extends IAuditLog, Document {}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    resourceType: { type: String, required: true },
    resourceId: { type: Schema.Types.ObjectId, required: true },
    previousValues: Schema.Types.Mixed,
    newValues: Schema.Types.Mixed,
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    status: { type: String, enum: ['Success', 'Failure'], default: 'Success' },
    errorMessage: String,
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<AuditLogDocument>('AuditLog', auditLogSchema);
