import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String }, 
    rating: { type: Number, default: 4.8 },
    duration: { type: String },

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
        keywords: [{ type: String }], 
        structuredData: { type: Object } 
    }
}, { timestamps: true });

// Create an index on slug for faster querying
serviceSchema.index({ slug: 1 });

export const Service = mongoose.model('Service', serviceSchema);