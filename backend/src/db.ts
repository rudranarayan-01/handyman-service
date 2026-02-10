import mongoose from 'mongoose';

// Connection status cache karne ke liye variable
let isConnected = false; 

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('🌵 Using existing MongoDB connection');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || '', {
            // In options se connection stable aur fast rehta hai
            maxPoolSize: 10, // Ek saath 10 connections allow karega
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000,
        });

        isConnected = !!db.connections[0].readyState;
        console.log(`🍃 New MongoDB Connected: ${db.connection.host}`);
    } catch (error) {
        console.error(`❌ DB Error: ${error}`);
    }
};

export default connectDB;