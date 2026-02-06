import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import connectDB from './db';
import serviceRoutes from './routes/categoryRoutes'; // Import router
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Base Prefix Setup
app.use('/api/v1/', serviceRoutes);
app.use('/api/v1/auth',authRoutes)
app.use("/api/v1/bookings",orderRoutes)

app.get('/', (req, res) => {
    res.send('Handyman API V1 is live! 🚀');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});