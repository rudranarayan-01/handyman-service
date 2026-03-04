import { Resend } from 'resend';
import twilio from 'twilio';

const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// --- Stylish Email Template Wrapper ---
const emailTemplate = (title: string, content: string, color: string = '#2563eb') => `
<div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: ${color}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">Handyman Service Pro</h1>
        </div>
        
        <div style="padding: 40px; color: #1e293b;">
            <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: #0f172a;">${title}</h2>
            <div style="line-height: 1.6; font-size: 16px;">
                ${content}
            </div>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            
            <p style="font-size: 14px; color: #64748b; text-align: center;">
                Need help? Contact our 24/7 support or reply to this email.
            </p>
        </div>
        
        <div style="background-color: #0f172a; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0; font-weight: bold; letter-spacing: 1px;">
                © 2026 HANDYMAN SERVICE PRO | SECURE & INSTANT
            </p>
        </div>
    </div>
</div>
`;

export const triggerOrderNotifications = async (order: any, partner?: any) => {
    const { status, customerDetails, orderId, items } = order;
    const serviceName = items[0]?.name || "Your Service";

    try {
        // --- 1. CONFIRMED ---
        if (status === 'confirmed' && partner) {
            const htmlContent = emailTemplate(
                "Professional Assigned!",
                `<p>Great news, <strong>${customerDetails.name}</strong>!</p>
                 <p>Your order for <strong>${serviceName}</strong> is confirmed. We have assigned our top-rated professional to your location.</p>
                 <div style="background-color: #f1f5f9; padding: 20px; border-radius: 16px; margin: 20px 0;">
                    <p style="margin: 0; color: #475569; font-size: 12px; font-weight: bold; text-transform: uppercase;">Assigned Professional</p>
                    <p style="margin: 5px 0; font-size: 18px; font-weight: 800;">${partner.name}</p>
                    <p style="margin: 0; color: #2563eb; font-weight: bold;">📞 ${partner.phone}</p>
                 </div>
                 <p>Order ID: <span style="font-family: monospace; background: #eee; padding: 2px 5px;">#${orderId.slice(-8).toUpperCase()}</span></p>`
            );

            await resend.emails.send({
                from: 'Handyman Service <onboarding@resend.dev>',
                to: customerDetails.email,
                subject: `Confirmed: Professional Assigned for ${serviceName}`,
                html: htmlContent
            });

            await resend.emails.send({
                from: 'Handyman Service <onboarding@resend.dev>',
                to: partner.email,
                subject: `New Assignment: ${serviceName}`,
                html: htmlContent
            });
        }

        // --- 2. COMPLETED ---
        if (status === 'completed') {
            const htmlContent = emailTemplate(
                "Service Completed Successfully!",
                `<p>Hi ${customerDetails.name},</p>
                 <p>Your <strong>${serviceName}</strong> is finished. We hope you're happy with the results!</p>
                 <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="background-color: #2563eb; color: #ffffff; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold;">Rate Your Experience</a>
                 </div>`,
                '#10b981' // Green theme for completion
            );

            await resend.emails.send({
                from: 'Handyman Service <onboarding@resend.dev>',
                to: customerDetails.email,
                subject: `Service Done: ${serviceName}`,
                html: htmlContent
            });

            await resend.emails.send({
                from: 'Handyman Service <onboarding@resend.dev>',
                to: partner.email,
                subject: `Service Completed: ${serviceName}`,
                html: htmlContent
            });

            // Twilio SMS
            // await twilioClient.messages.create({
            //     body: `Great news! Your ${serviceName} is complete. Thank you for choosing Handyman Service Pro!`,
            //     from: process.env.TWILIO_PHONE_NUMBER,
            //     to: customerDetails.phone
            // });
        }

        // --- 3. CANCELLED ---
        if (status === 'cancelled') {
            const htmlContent = emailTemplate(
                "Order Cancelled",
                `<p>Hi ${customerDetails.name},</p>
                 <p>Your order for <strong>${serviceName}</strong> has been cancelled as per your request or system update.</p>
                 <p>If this was a mistake, please reach out to us immediately.</p>`,
                '#ef4444' // Red theme for cancellation
            );

            await resend.emails.send({
                from: 'Handyman Service <onboarding@resend.dev>',
                to: customerDetails.email,
                subject: `Cancelled: Order #${orderId.slice(-8).toUpperCase()}`,
                html: htmlContent
            });
            await resend.emails.send({
                from: 'Handyman Service <onboarding@resend.dev>',
                to: partner.email,
                subject: `Cancelled: ${serviceName}`,
                html: htmlContent
            });
            
        }
        console.log(`Notification sent for order ${orderId} with status ${status}`);

    } catch (error) {
        console.error("Notification Service Failed:", error);
    }
};