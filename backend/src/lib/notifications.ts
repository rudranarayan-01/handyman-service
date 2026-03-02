// /services/notification.service.ts
import { Resend } from 'resend';
import twilio from 'twilio';

const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const triggerOrderNotifications = async (order: any, partner?: any) => {
    const { status, customerDetails, orderId, items } = order;
    const serviceName = items[0]?.name || "Your Service";
    console.log(`Triggering notifications for Order ID: ${orderId}, Status: ${status}, service: ${serviceName}`);

    try {
        // --- 1. LOGIC FOR "CONFIRMED" (PARTNER ASSIGNED) ---
        if (status === 'confirmed' && partner) {
            // SMS to Customer
            // await twilioClient.messages.create({
            //     body: `Hi ${customerDetails.name}, your ${serviceName} is confirmed! Professional ${partner.name} (${partner.phone}) is on the way. Order ID: ${orderId}`,
            //     from: process.env.TWILIO_PHONE_NUMBER,
            //     to: customerDetails.phone
            // });

            // Email to Customer via Resend
            await resend.emails.send({
                from: 'Support <delivered@resend.dev>', // Use your verified domain in production
                to: customerDetails.email,
                subject: `Order Confirmed: ${orderId}`,
                html: `<strong>Professional Assigned!</strong><br/>${partner.name} has been assigned to your order for ${serviceName}.`
            });
            // Email to Partner via Resend
            await resend.emails.send({
                from: 'Support <delivered@resend.dev>', 
                to: partner.email,
                subject: `Order Confirmed: ${orderId}`,
                html: `<strong>Professional Assigned!</strong><br/>${partner.name} has been assigned to your order for ${serviceName}.`
            });

            // SMS to Partner
            // await twilioClient.messages.create({
            //     body: `New Job Assigned! Order: ${orderId}. Customer: ${customerDetails.name}, Address: ${customerDetails.address}.`,
            //     from: process.env.TWILIO_PHONE_NUMBER,
            //     to: partner.phone
            // });

            console.log(`Notifications for CONFIRMATION would be sent here. Partner: ${partner.name}, Customer: ${customerDetails.name}`);
        }

        // --- 2. LOGIC FOR "COMPLETED" ---
        if (status === 'completed') {
            // SMS to Customer
            await twilioClient.messages.create({
                body: `Great news! Your ${serviceName} order (${orderId}) has been marked as completed. Thank you for choosing us!`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: customerDetails.phone
            });

            // Email to Customer
            await resend.emails.send({
                from: 'Support <delivered@resend.dev>', // Use your verified domain in production
                to: customerDetails.email,
                subject: `Order Completed: ${orderId}`,
                html: `<h1>Job Done!</h1><p>Your service ${serviceName} was completed successfully.</p>`
            });
            console.log(`Notifications for COMPLETION would be sent here. Customer: ${customerDetails.name}`);
        }
        if (status === 'cancelled') {
            // SMS to Customer
            // await twilioClient.messages.create({
            //     body: `Order Cancelled! Your ${serviceName} order (${orderId}) has been marked as cancelled.`,
            //     from: process.env.TWILIO_PHONE_NUMBER,
            //     to: customerDetails.phone
            // });

            // Email to Customer
            await resend.emails.send({
                from: 'Support <delivered@resend.dev>', // Use your verified domain in production
                to: customerDetails.email,
                subject: `Order Cancelled: ${orderId}`,
                html: `<h1>Order Cancelled!</h1><p>Your service ${serviceName} was cancelled.</p>`
            });
            console.log(`Notifications for CANCELLATION would be sent here. Customer: ${customerDetails.name}`);
        }

    } catch (error) {
        // We log the error but don't "throw" it, so the Order Update still works
        console.error("Notification Service Failed:", error);
    }
};