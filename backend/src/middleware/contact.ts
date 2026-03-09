import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

interface ContactBody {
    name: string;
    email: string;
    subject: string;
    message: string;
}

// 1. Create the Transporter
// Using your Gmail User and App Password provided
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'codingislife01@gmail.com',
        pass: 'ptcg zomp usbf hmbp', // Your Gmail App Password
    },
});

export const sendContactEmail = async (req: Request<{}, {}, ContactBody>, res: Response) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Configure Email Content
    const mailOptions = {
        from: `"Housexpertz Hub" <codingislife01@gmail.com>`, // Must be your Gmail
        to: 'rudranarayansahu080@gmail.com', // Your business inbox
        replyTo: email, // Allows you to click 'Reply' and email the customer back directly
        subject: `Housexpertz Inquiry: ${subject || 'New Message'}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; color: #1e293b; line-height: 1.6; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                <div style="background-color: #1e3a8a; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Service Inquiry</h1>
                </div>
                
                <div style="padding: 30px; background-color: #ffffff;">
                    <p style="margin-top: 0;">You have received a new message through the <strong>Housexpertz</strong> contact form:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr>
                            <td style="padding: 8px 0; color: #64748b; width: 100px;"><strong>Client:</strong></td>
                            <td style="padding: 8px 0;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td>
                            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; color: #64748b;"><strong>Subject:</strong></td>
                            <td style="padding: 8px 0;">${subject}</td>
                        </tr>
                    </table>

                    <div style="background-color: #f8fafc; border-left: 4px solid #1e3a8a; padding: 20px; margin-top: 25px; border-radius: 4px;">
                        <p style="margin: 0; font-weight: bold; color: #1e3a8a; margin-bottom: 10px;">Message Detail:</p>
                        <p style="margin: 0; white-space: pre-wrap; color: #334155;">${message}</p>
                    </div>
                </div>

                <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
                    This email was sent from the Housexpertz Contact Portal.
                </div>
            </div>
        `,
    };

    try {
        // 3. Send the Email
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent successfully" });
    } catch (err) {
        console.error("Nodemailer Error:", err);
        return res.status(500).json({ 
            message: "Internal Server Error", 
            error: err instanceof Error ? err.message : "Unknown error" 
        });
    }
};