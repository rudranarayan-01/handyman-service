import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Service } from './models/Service';

dotenv.config();

const dummyServices = [
    // 1. Home Maintenance
    { name: "Tap Repair & Leakage", category: "Home Maintenance", price: 199, description: "Fixing leaky taps and minor plumbing issues.", image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189", duration: "30-45 mins" },
    
    // 2. Cleaning & Pest Control
    { name: "Full Home Deep Cleaning", category: "Cleaning & Pest Control", price: 2999, description: "Professional deep cleaning for 2BHK/3BHK.", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6958", duration: "4-6 hours" },
    
    // 3. Appliance Repair
    { name: "AC Service (Filter Cleaning)", category: "Appliance Repair", price: 499, description: "Jet pump cleaning for better cooling.", image: "https://images.unsplash.com/photo-1621905252507-b354bcadcabc", duration: "60 mins" },
    
    // 4. Home Renovations
    { name: "Wall Painting (Luxe Finish)", category: "Home Renovations", price: 5000, description: "Premium emulsion painting for living room.", image: "https://images.unsplash.com/photo-1589939705384-5185138a047a", duration: "2-3 days" },
    
    // 5. Security & Smart Home
    { name: "CCTV Camera Installation", category: "Security & Smart Home", price: 1200, description: "Setting up 4-channel security system.", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9", duration: "2 hours" },
    
    // 6. Outdoor & Lifestyle
    { name: "Garden Maintenance", category: "Outdoor & Lifestyle", price: 899, description: "Trimming, weeding, and soil fertilization.", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae", duration: "90 mins" }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log("🍃 Connected to DB for Seeding...");
        
        // Purana data delete karein (Optional)
        await Service.deleteMany({});
        
        // To insert dummy services into the database
        await Service.insertMany(dummyServices);
        
        console.log("✅ Database Seeded Successfully!");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};

seedDB();