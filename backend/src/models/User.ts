import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true }, // Clerk ki unique ID
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    photo: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }] // Order history link
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);