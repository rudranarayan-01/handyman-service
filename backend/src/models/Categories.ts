import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }, // For those sexy category cards we built!
}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);