import mongoose, { Document, Schema, model } from 'mongoose';

// --- SUB-INTERFACES ---
export interface IServiceVariant {
    title: string;          // e.g., "HD Makeup", "2 Bathrooms", "Base Fare (0-5km)"
    price: number;          // Actual price for this variant
    originalPrice?: number; // For "Strike-through" discount display
    description?: string;   // Short detail for this specific choice
}

export interface IService extends Document {
    name: string;
    slug: string;
    category: mongoose.Types.ObjectId;
    
    // FLEXIBLE PRICING FIELDS
    basePrice: number;       // The "Starting From" price for SEO/Listing
    pricingType: 'fixed' | 'variant' | 'quantity' | 'distance'; 
    unitName?: string;       // e.g., "Bathroom", "KM", "Person"
    variants: IServiceVariant[]; 
    
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
    slug: { type: String, unique: true, lowercase: true, trim: true, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    
    // NEW FLEXIBLE LOGIC
    basePrice: { type: Number, required: true }, 
    pricingType: { 
        type: String, 
        enum: ['fixed', 'variant', 'quantity', 'distance'], 
        default: 'fixed' 
    },
    unitName: { type: String, trim: true }, // "Bathroom", "KM"
    variants: [{
        title: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number },
        description: { type: String }
    }],

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

// ✅ SLUG GENERATION
serviceSchema.pre('save', async function () {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') 
            .replace(/\s+/g, '-');
    }
});

serviceSchema.index({ slug: 1 });

export const Service = model<IService>('Service', serviceSchema);