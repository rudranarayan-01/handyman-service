import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    description: { type: String },
    image: { type: String },

    // ── SEO FIELDS ──
    seo: {
        metaTitle: { 
            type: String, 
            trim: true,
            maxLength: 60 
        },
        metaDescription: { 
            type: String, 
            trim: true,
            maxLength: 160 
        },
        keywords: [{ type: String }]
    }
}, { timestamps: true });

categorySchema.index({ slug: 1 });

export const Category = mongoose.model('Category', categorySchema);