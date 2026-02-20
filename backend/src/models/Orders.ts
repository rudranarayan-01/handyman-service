import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    orderId: string;
    userId: string;
    customerDetails: {
        name: string;
        email: string;
        phone: string;
        address: string;
    };
    items: Array<{
        serviceId: mongoose.Types.ObjectId;
        name: string;
        price: number;
        image: string;
    }>;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    // --- Fixed Feedback Interface ---
    feedback?: {
        rating: number;
        comment: string;
        submittedAt: Date;
    };
    totalAmount: number;
    bookingDate: Date;
    serviceFee: number;
    assignedPartner?: mongoose.Types.ObjectId | any;
}

const orderSchema = new Schema<IOrder>({
    orderId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    customerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },
    items: [{
        serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
        name: String,
        price: Number,
        image: String
    }],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
        index: true
    },
    feedback: {
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        submittedAt: { type: Date }
    },
    totalAmount: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    serviceFee: { type: Number, default: 19 },
    assignedPartner: {
        type: Schema.Types.ObjectId,
        ref: 'Partner',
        default: null
    }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', orderSchema);