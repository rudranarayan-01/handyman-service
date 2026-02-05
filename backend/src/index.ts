import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { clerkMiddleware, getAuth } from '@clerk/express';
import connectDB from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req: Request, res: Response) => {
    res.send('Handyman Backend is LIVE! 🚀');
});

// Protected Route
app.get('/api/test-auth', (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ message: "Not logged in" });
    }
    res.json({ message: "Authenticated!", userId });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});