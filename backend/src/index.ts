import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import connectDB from './db';
import serviceRoutes from './routes/serviceRoutes'; // Import router

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Base Prefix Setup
app.use('/api/v1/services', serviceRoutes);

app.get('/', (req, res) => {
    res.send('Handyman API V1 is live! 🚀');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});