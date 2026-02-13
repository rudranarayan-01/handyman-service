import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String }, 
    rating: { type: Number, default: 4.8 },
    duration: { type: String } 
}, { timestamps: true });

export const Service = mongoose.model('Service', serviceSchema);