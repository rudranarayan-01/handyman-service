import mongoose, { Document, Schema, model } from 'mongoose';

// --- SUB-INTERFACES ---
export interface IServiceVariant {
    title: string;           // e.g., "HD Makeup", "2 Bathrooms"
    price: number;           // Actual price for this variant
    originalPrice?: number;  // For "Strike-through" discount
    description?: string;    // Short detail for this specific choice
}

export interface IService extends Document {
    name: string;
    slug: string;
    category: mongoose.Types.ObjectId;
    
    // FLEXIBLE PRICING FIELDS
    basePrice: number;       
    pricingType: 'fixed' | 'variant' | 'quantity' | 'distance'; 
    unitName?: string;       
    variants: IServiceVariant[]; 
    
    description?: string;
    image?: string;

    // --- UPDATED RATING FIELDS ---
    rating: number;          // Average: calculated as (totalRatingSum / numReviews)
    numReviews: number;      // Total number of users who rated
    totalRatingSum: number;  // Cumulative sum of all stars given
    
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
    slug: { type: String, unique: true, lowercase: true, trim: true, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    
    basePrice: { type: Number, required: true }, 
    pricingType: { 
        type: String, 
        enum: ['fixed', 'variant', 'quantity', 'distance'], 
        default: 'fixed' 
    },
    unitName: { type: String, trim: true }, 
    variants: [{
        title: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number },
        description: { type: String }
    }],

    description: { type: String },
    image: { type: String }, 

    // --- RATING DEFAULTS ---
    // We start at 0 so new services don't have "fake" high ratings.
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    totalRatingSum: { type: Number, default: 0 },

    duration: { type: String },
    seo: {
        metaTitle: { type: String, trim: true, maxLength: 60 },
        metaDescription: { type: String, trim: true, maxLength: 160 },
        keywords: [{ type: String }], 
        structuredData: { type: Object } 
    }
}, { timestamps: true });

// ✅ SLUG GENERATION
serviceSchema.pre('save', async function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') 
            .replace(/\s+/g, '-');
    }
    // next(); // Added next() call for proper middleware execution
});

serviceSchema.index({ slug: 1 });

export const Service = model<IService>('Service', serviceSchema);