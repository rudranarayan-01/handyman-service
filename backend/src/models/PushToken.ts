import mongoose, { Schema, Document } from 'mongoose';

export interface IPushToken extends Document {
    clerkId: string;
    expoPushToken: string;
    devicePlatform?: string; // 'ios' | 'android'
    createdAt: Date;
}

const PushTokenSchema: Schema = new Schema({
    clerkId: { type: String, required: true, index: true },
    expoPushToken: { type: String, required: true, unique: true }, // Prevents token duplicates
    devicePlatform: { type: String, enum: ['ios', 'android', 'web', 'unknown'], default: 'unknown' }
}, {
    timestamps: true
});

// Create a compound index for lightning-fast lookups when targeting a user
PushTokenSchema.index({ clerkId: 1, expoPushToken: 1 });

export default mongoose.model<IPushToken>('PushToken', PushTokenSchema);