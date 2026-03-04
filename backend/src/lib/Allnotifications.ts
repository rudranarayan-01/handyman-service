import { Resend } from 'resend';
import { sendWhatsAppMessage } from './whatsapp_setup';

const resend = new Resend(process.env.RESEND_API_KEY);

// --- Helper: Format Phone for WhatsApp (91 prefix) ---
const formatWAHandle = (phone: string) => {
    if (!phone) return "";
    const clean = phone.replace(/\D/g, '');
    return clean.length === 10 ? `91${clean}` : clean;
};

// --- Stylish Email Template Wrapper ---
const emailTemplate = (title: string, content: string, color: string = '#2563eb') => `
<div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: ${color}; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">Handyman Service Pro</h1>
        </div>
        <div style="padding: 40px; color: #1e293b;">
            <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 20px; color: #0f172a;">${title}</h2>
            <div style="line-height: 1.6; font-size: 16px;">${content}</div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="font-size: 14px; color: #64748b; text-align: center;">Need help? Contact our 24/7 support or reply to this email.</p>
        </div>
        <div style="background-color: #0f172a; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0; font-weight: bold; letter-spacing: 1px;">© 2026 HANDYMAN SERVICE PRO | SECURE & INSTANT</p>
        </div>
    </div>
</div>
`;

export const triggerOrderNotifications = async (order: any, partner?: any) => {
    const { status, customerDetails, orderId, items } = order;
    const serviceName = items[0]?.name || "Your Service";
    const shortId = orderId.slice(-8).toUpperCase();

    try {
        // --- 1. CONFIRMED (Always sends to both Partner and Customer) ---
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
                 <p>Order ID: <span style="font-family: monospace; background: #eee; padding: 2px 5px;">#${shortId}</span></p>`
            );

            // Emails
            await Promise.allSettled([
                resend.emails.send({ from: 'Handyman Service <onboarding@resend.dev>', to: customerDetails.email, subject: `Confirmed: Professional Assigned for ${serviceName}`, html: htmlContent }),
                resend.emails.send({ from: 'Handyman Service <onboarding@resend.dev>', to: partner.email, subject: `New Assignment: ${serviceName}`, html: htmlContent })
            ]);

            // WhatsApps
            const customerWaMsg = `*HANDYMAN PRO: Professional Assigned!* 🛠️\n\nHi *${customerDetails.name}*, your service for *${serviceName}* is confirmed.\n\n👤 *Expert:* ${partner.name}\n📞 *Contact:* ${partner.phone}\n🆔 *Order ID:* #${shortId}\n\nOur expert will reach your location shortly.`;
            const partnerWaMsg = `*NEW JOB ASSIGNED* 👷\n\nHi *${partner.name}*, you have a new task:\n\n📌 *Service:* ${serviceName}\n👤 *Client:* ${customerDetails.name}\n📍 *Address:* ${customerDetails.address}\n📞 *Client Phone:* ${customerDetails.phone}\n🆔 *Order ID:* #${shortId}`;

            sendWhatsAppMessage(formatWAHandle(customerDetails.phone), customerWaMsg).catch(e => console.log("WA Error Customer:", e));
            sendWhatsAppMessage(formatWAHandle(partner.phone), partnerWaMsg).catch(e => console.log("WA Error Partner:", e));
        }

        // --- 2. COMPLETED ---
        if (status === 'completed') {
            const htmlContent = emailTemplate(
                "Service Completed Successfully!",
                `<p>Hi ${customerDetails.name},</p>
                 <p>Your <strong>${serviceName}</strong> is finished. We hope you're happy with the results!</p>`,
                '#10b981'
            );

            // Always send to Customer, only send to Partner if exists
            const emailRecipients = [
                resend.emails.send({ from: 'Handyman Service <onboarding@resend.dev>', to: customerDetails.email, subject: `Service Done: ${serviceName}`, html: htmlContent })
            ];
            if (partner?.email) {
                emailRecipients.push(resend.emails.send({ from: 'Handyman Service <onboarding@resend.dev>', to: partner.email, subject: `Job Completed: ${serviceName}`, html: htmlContent }));
            }
            await Promise.allSettled(emailRecipients);

            // WhatsApp - Customer
            const completedWaMsg = `*SERVICE COMPLETED* ✅\n\nHi *${customerDetails.name}*, your *${serviceName}* is successfully finished. We hope you liked the service!`;
            sendWhatsAppMessage(formatWAHandle(customerDetails.phone), completedWaMsg).catch(e => console.log("WA Error Customer:", e));

            // WhatsApp - Partner (Only if exists)
            if (partner?.phone) {
                const partnerCompletedWaMsg = `*JOB COMPLETED* ✅\n\nHi *${partner.name}*, the order *#${shortId}* for *${serviceName}* has been marked as completed. Well done!`;
                sendWhatsAppMessage(formatWAHandle(partner.phone), partnerCompletedWaMsg).catch(e => console.log("WA Error Partner:", e));
            }
        }

        // --- 3. CANCELLED ---
        if (status === 'cancelled') {
            const htmlContent = emailTemplate(
                "Order Cancelled",
                `<p>Hi ${customerDetails.name},</p>
                 <p>Your order for <strong>${serviceName}</strong> has been cancelled.</p>`,
                '#ef4444'
            );

            // Always send to Customer, only send to Partner if exists
            const emailRecipients = [
                resend.emails.send({ from: 'Handyman Service <onboarding@resend.dev>', to: customerDetails.email, subject: `Cancelled: Order #${shortId}`, html: htmlContent })
            ];
            if (partner?.email) {
                emailRecipients.push(resend.emails.send({ from: 'Handyman Service <onboarding@resend.dev>', to: partner.email, subject: `Job Cancelled: ${serviceName}`, html: htmlContent }));
            }
            await Promise.allSettled(emailRecipients);

            // WhatsApp - Customer
            const cancelWaMsg = `*ORDER CANCELLED* ❌\n\nHi *${customerDetails.name}*, your order *#${shortId}* for *${serviceName}* has been cancelled.`;
            sendWhatsAppMessage(formatWAHandle(customerDetails.phone), cancelWaMsg).catch(e => console.log("WA Error Customer:", e));

            // WhatsApp - Partner (Only if exists)
            if (partner?.phone) {
                const partnerCancelWaMsg = `*JOB CANCELLED* ❌\n\nHi *${partner.name}*, the order *#${shortId}* for *${serviceName}* assigned to you has been cancelled.`;
                sendWhatsAppMessage(formatWAHandle(partner.phone), partnerCancelWaMsg).catch(e => console.log("WA Error Partner:", e));
            }
        }

        console.log(`Notifications triggered for order ${orderId} status: ${status}`);

    } catch (error) {
        console.error("Notification Service Failed:", error);
    }
};