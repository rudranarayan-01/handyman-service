import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import connectDB from './db';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import serviceRoutes from './routes/serviceRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Base Prefix Setup
app.use('/api/v1/auth',authRoutes)
app.use("/api/v1/orders",orderRoutes)
app.use('/api/v1/services', serviceRoutes);

app.get('/', (req, res) => {
    res.send('Handyman API V1 is live! 🚀');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});