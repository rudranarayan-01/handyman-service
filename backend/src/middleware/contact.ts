import { Request, Response } from 'express';
import { Resend } from 'resend';

// Initialize Resend - Store your key in .env
const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactBody {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const sendContactEmail = async (req: Request<{}, {}, ContactBody>, res: Response) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Handyman Hub <onboarding@resend.dev>', // Verify your domain to change this
            to: ['rudranarayansahu080@gmail.com'], // Your business inbox
            replyTo: email,
            subject: `Contact: ${subject || 'New Inquiry'}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
                    <h2 style="color: #4f46e5;">New Message from ${name}</h2>
                    <p><strong>From:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="background: #f4f4f7; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                    <footer style="margin-top: 20px; font-size: 12px; color: #999;">
                        Sent via Handyman Contact Form
                    </footer>
                </div>
            `,
        });

        if (error) {
            return res.status(400).json({ error });
        }

        return res.status(200).json({ message: "Email sent successfully", data });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err });
    }
};