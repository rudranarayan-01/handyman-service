import mongoose from 'mongoose';

// Address Sub-Schema
const addressSchema = new mongoose.Schema({
    label: { type: String, default: 'Home' }, 
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    addressLine: { type: String, required: true }, 
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    photo: { type: String },
    role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' },
    addresses: [addressSchema],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);