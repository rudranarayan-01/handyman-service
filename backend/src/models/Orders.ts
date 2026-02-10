import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, index: true ,required: true }, // Clerk ID
    items: [{
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
        name: String,
        price: Number
    }],
    bookingDate: { type: Date, default: Date.now }, 
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    totalAmount: { type: Number, required: true }, // Total price
    serviceFee: { type: Number, default: 19 }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);