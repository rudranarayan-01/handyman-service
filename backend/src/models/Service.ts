import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // This connects the Service to a specific Category ID
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String }, 
    rating: { type: Number, default: 4.8 },
    duration: { type: String } 
}, { timestamps: true });

export const Service = mongoose.model('Service', serviceSchema);