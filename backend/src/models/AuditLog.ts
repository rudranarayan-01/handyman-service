// models/AuditLog.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    title: string;          // e.g., "Role Updated"
    description: string;    // e.g., "Changed user@example.com role from user to admin"
    module: string;         // e.g., "USER_MANAGEMENT", "SERVICE_BOOKING", "AUTH"
    performer: {
        clerkId: string;
        email: string;
        username: string;
    };
    status: 'success' | 'failure' | 'warning';
    ipAddress: string;
    userAgent: string;      // Device/Browser info
    timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    module: { type: String, required: true, index: true },
    performer: {
        clerkId: { type: String, required: true, index: true },
        email: { type: String, required: true },
        username: { type: String }
    },
    status: { type: String, enum: ['success', 'failure', 'warning'], default: 'success' },
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: Date, default: Date.now, index: true } // Indexed for fast sorting
});

// For large scale: Auto-delete logs older than 90 days to save space
AuditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);