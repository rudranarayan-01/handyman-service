import { GoogleGenerativeAI } from "@google/generative-ai";
import { Service } from "../models/Service";
import AiLogs from "../models/AiLogs";
import express from "express";

const router = express.Router();

// Initialize with a check for the key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("ERROR: GEMINI_API_KEY is missing from .env");
}
const genAI = new GoogleGenerativeAI(apiKey || "");

router.post("/chat", async (req, res) => {
    const { message } = req.body;
    // Inside your route
    const clerkId = (req as any).auth?.userId;
    let modelName = "gemini-2.5-flash"; // Standard production model
    let context = "";
    let aiTextResponse = "";

    try {
        if (!message) return res.status(400).json({ error: "No message provided" });

        // 3. Fetch Service Data for Context
        const services = await Service.find().select('name basePrice description duration');
        context = services.length > 0
            ? JSON.stringify(services)
            : "No specific service data available. Refer user to general support.";

        // 4. Model Selection with Fallback
        let model;
        try {
            // Note: gemini-2.0-flash is currently the latest stable/experimental. 
            // gemini-1.5-flash is the standard high-speed model.
            model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        } catch (e) {
            modelName = "gemini-pro";
            model = genAI.getGenerativeModel({ model: "gemini-pro" });
        }

        // 5. System Instructions
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

        // 6. Generate Content
        const result = await model.generateContent(prompt);
        aiTextResponse = result.response.text();

        // 7. Store Log in Database
        await AiLogs.create({
            clerkId: clerkId || "GUEST",
            userMessage: message,
            aiResponse: aiTextResponse,
            modelUsed: modelName,
            contextUsed: context.substring(0, 1000),
            status: 'success'
        });


        return res.json({ reply: aiTextResponse });

    } catch (error: any) {
        console.error("AI Chat Detailed Error:", error);

        // Specific handling for 404/Model errors
        if (error.status === 404 || error.message?.includes('not found')) {
            return res.status(500).json({
                reply: "I'm currently updating my systems. Please reach out via WhatsApp at +91 98117 97407 for immediate help!"
            });
        }

        return res.status(500).json({ error: "Internal AI Error" });
    }
});

export default router;