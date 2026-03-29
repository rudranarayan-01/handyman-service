import { GoogleGenerativeAI } from "@google/generative-ai";
import { Service } from "../models/Service";
import express from "express";
const router = express.Router();

// Initialize with a check for the key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is missing from .env");
}
const genAI = new GoogleGenerativeAI(apiKey || "");

router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "No message provided" });

        // 1. Fetch Service Data
        const services = await Service.find().select('name basePrice description duration');
        const context = services.length > 0 
            ? JSON.stringify(services) 
            : "No specific service data available. Refer user to general support.";

        // 2. Try the most efficient model first
        // If 'gemini-1.5-flash' gives a 404, your SDK or Key might prefer 'gemini-pro'
        let model;
        try {
            // Update this line in aiRoutes.ts
            model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        } catch (e) {
            model = genAI.getGenerativeModel({ model: "gemini-pro" });
        }

        // 3. Structured Prompt (Cleaner format for AI)
        const systemInstruction = `
            You are the HouseXpertz AI Assistant.
            BUSINESS CONTEXT:
            ${context}

            GUIDELINES:
            - Provide professional, concise help for home services.
            - For any pricing, always say "starting from [price]".
            - If the user asks for a service NOT listed in the context, politely direct them to WhatsApp: https://wa.me/919811797407
            - Keep responses under 3 sentences where possible.
        `;

        const prompt = `${systemInstruction}\n\nUser Question: ${message}`;

        // 4. Generate Content
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        res.json({ reply: text });

    } catch (error: any) {
        console.error("AI Chat Detailed Error:", error);
        
        // Specific handling for 404/Model errors
        if (error.status === 404) {
             return res.status(500).json({ 
                reply: "I'm currently updating my systems. Please reach out via WhatsApp for immediate help!" 
            });
        }

        res.status(500).json({ error: "Internal AI Error" });
    }
});

export default router;