import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

import connectDB from './db';

import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import serviceRoutes from './routes/serviceRoutes';
import categoryRoutes from './routes/categoryRoutes';
import userRoutes from "./routes/userRoutes"
import addressRoutes from "./routes/addressRoutes"
import adminRoutes from "./routes/adminRoutes"
import contactRoutes from "./routes/contactRoutes"
import providerRoutes from "./routes/providerRoutes"
import offersRoutes from "./routes/offersRoutes"
import aiRoutes from "./routes/aiRoutes"
import { clerkMiddleware } from '@clerk/express';
import { connectToWhatsApp, sendWhatsAppMessage } from './lib/whatsapp_setup';
import { subscribeToNewsletter } from './lib/mail';
import { generateSitemap } from './controllers/sitemapControllers';
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(compression());

const allowedOrigins = [
    "https://housexpertz.in",
    "https://handyman-service-uhsx.onrender.com",
    "http://localhost:5173",
];

app.use(cors({
    origin: (origin, callback) => {
        // !origin allows mobile apps, Postman, and local native clients to pass through cleanly
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS security guidelines"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.use(clerkMiddleware());

// Base Prefix Setup
app.use('/api/v1/auth', authRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/address', addressRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/partners", providerRoutes)
app.use("/api/v1/offers", offersRoutes)
app.use("/api/v1", contactRoutes)
app.use("/api/v1/ai", aiRoutes);
app.get('/api/v1/sitemap', generateSitemap);





app.get('/', (req, res) => {
    res.send('Housexpertz API V1 is live! 🚀');
});

app.get('/test-wa', async (req, res) => {
    try {
        const myNumber = "918260348599";
        await sendWhatsAppMessage(myNumber, "🛠️ *Housexpertz Pro Test*\n\nIf you're reading this, the bot is working perfectly!");
        res.send("Message Sent!");
    } catch (err) {
        res.status(500).send("Error");
    }
});

app.post("/api/v1/subscribe", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        await subscribeToNewsletter(email);
        res.status(200).json({ message: "Subscription successful" });
    } catch (error) {
        res.status(500).json({ message: "Subscription failed" });
    }
});

app.use(express.static('public', {
    maxAge: '1y', // Cache for 1 year
    etag: false
}));

app.set('trust proxy', true);
// await connectToWhatsApp();
app.listen(PORT, async () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    // await connectToWhatsApp();
});