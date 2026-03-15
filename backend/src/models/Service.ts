import mongoose, { Document, Schema, model } from 'mongoose';

// Interface for TypeScript
export interface IService extends Document {
    name: string;
    slug: string;
    category: mongoose.Types.ObjectId;
    price: number;
    description?: string;
    image?: string;
    rating: number;
    duration?: string;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
        structuredData?: any;
    };
    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema = new Schema<IService>({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    slug: { 
        type: String, 
        unique: true, 
        lowercase: true, 
        trim: true,
        required: true // Keeping required since we will provide it manually
    },
    category: { 
        type: Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    description: { type: String },
    image: { type: String }, 
    rating: { type: Number, default: 4.8 },
    duration: { type: String },
    seo: {
        metaTitle: { type: String, trim: true, maxLength: 60 },
        metaDescription: { type: String, trim: true, maxLength: 160 },
        keywords: [{ type: String }], 
        structuredData: { type: Object } 
    }
}, { timestamps: true });

// Index for fast lookups by slug
serviceSchema.index({ slug: 1 });

export const Service = model<IService>('Service', serviceSchema);