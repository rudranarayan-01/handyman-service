import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    serviceAreas: [{ type: String, lowercase: true, trim: true }], 
    specializations: [{ type: String }], 
    isVerified: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },

    createdAt: { type: Date, default: Date.now }
});

export const Partner = mongoose.model('Partner', partnerSchema);
