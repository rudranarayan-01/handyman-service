import mongoose, { Schema, Document } from 'mongoose';

export interface IAIChat extends Document {
  clerkId?: string;        // Optional if user is not logged in
  userMessage: string;
  aiResponse: string;
  modelUsed: string;       // e.g., 'gemini-1.5-flash'
  contextUsed: string;     // The service data passed to AI
  status: 'success' | 'error';
  timestamp: Date;
}

const AIChatSchema: Schema = new Schema({
  clerkId: { type: String, index: true }, 
  userMessage: { type: String, required: true },
  aiResponse: { type: String, required: true },
  modelUsed: { type: String },
  contextUsed: { type: String }, // Useful for debugging what the AI "saw"
  status: { type: String, enum: ['success', 'error'], default: 'success' },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Auto-delete chat logs after 30 days to keep the DB lean
AIChatSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

export default mongoose.model<IAIChat>('AIChat', AIChatSchema);