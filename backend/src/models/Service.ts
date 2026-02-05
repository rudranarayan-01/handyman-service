import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: [
            'Home Maintenance',
            'Cleaning & Pest Control',
            'Appliance Repair',
            'Home Renovations',
            'Security & Smart Home',
            'Outdoor & Lifestyle'
        ] 
    },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String }, 
    rating: { type: Number, default: 4.8 },
    duration: { type: String } 
}, { timestamps: true });

export const Service = mongoose.model('Service', serviceSchema);