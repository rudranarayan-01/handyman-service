import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true }, 
    description: { type: String, required: true }, 
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true }, 
    minOrderAmount: { type: Number, default: 0 }, 
    maxDiscount: { type: Number }, 
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 }, 
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Offer = mongoose.model('Offers', OfferSchema);