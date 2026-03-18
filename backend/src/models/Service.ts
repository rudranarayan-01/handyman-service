import mongoose, { Document, Schema, model } from 'mongoose';

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
    name: { type: String, required: true, trim: true },
    slug: { 
        type: String, 
        unique: true, 
        lowercase: true, 
        trim: true,
        required: true 
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
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


// ✅ FIXED PRE SAVE HOOK (NO next, NO TYPE ERROR)
serviceSchema.pre('save', async function () {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') 
            .replace(/\s+/g, '-');
    }
});


// Optional: ensure slug uniqueness index
serviceSchema.index({ slug: 1 });

export const Service = model<IService>('Service', serviceSchema);