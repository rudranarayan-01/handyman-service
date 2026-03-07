import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true }, // e.g., 'FIRST50'
    description: { type: String, required: true }, // e.g., '50% off on your first booking'
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true }, // e.g., 50 (for 50%) or 100 (for ₹100)
    minOrderAmount: { type: Number, default: 0 }, // Minimum booking value to use this
    maxDiscount: { type: Number }, // For percentage: cap the discount at e.g. ₹200
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 }, // Total times this can be used
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Offer = mongoose.model('Offers', OfferSchema);