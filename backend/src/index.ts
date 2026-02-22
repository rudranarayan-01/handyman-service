import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import connectDB from './db';

import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import serviceRoutes from './routes/serviceRoutes';
import userRoutes from "./routes/userRoutes"
import addressRoutes from "./routes/addressRoutes"
import adminRoutes from "./routes/adminRoutes"
import { clerkMiddleware } from '@clerk/express';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
    origin: [
        "https://handyman-service-uhsx.onrender.com",
        "http://localhost:5173" // for local development
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.use(express.json());
app.use(clerkMiddleware());

// Base Prefix Setup
app.use('/api/v1/auth', authRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/address', addressRoutes)
app.use("/api/v1/admin", adminRoutes)


app.get('/', (req, res) => {
    res.send('Handyman API V1 is live! 🚀');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});