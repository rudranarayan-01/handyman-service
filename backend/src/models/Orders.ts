import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    orderId: string;      // Human readable unique ID
    userId: string;       // Clerk ID (Owner of the order)
    customerDetails: {    // Snapshot of user info for scalability
        name: string;
        email: string;
        phone: string, 
        address:string,
    };
    items: Array<{
        serviceId: mongoose.Types.ObjectId;
        name: string;
        price: number;
        image: string;
    }>;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    totalAmount: number;
    bookingDate: Date;
    serviceFee: number;
}

const orderSchema = new Schema<IOrder>({
    // Scalability: Custom Order ID for easy search
    orderId: { 
        type: String, 
        unique: true, 
        required: true, 
        index: true 
    },
    // Association: Clerk User ID linked to this order
    userId: { 
        type: String, 
        required: true, 
        index: true 
    },
    customerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: {type: String, required: true},
        address: {type:String, required:true}
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
        index: true // Indexing status because Admins filter by status often
    },
    totalAmount: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now },
    serviceFee: { type: Number, default: 19 }
}, { timestamps: true });

export const Order = mongoose.model<IOrder>('Order', orderSchema);