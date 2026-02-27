import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order: any) => {
    const doc = new jsPDF();
    
    // Formatting the current date
    const date = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // --- Type-Safe Color Definitions ---
    const primaryColor: [number, number, number] = [31, 41, 55];    // Slate 800
    const accentColor: [number, number, number] = [37, 99, 235];     // Blue 600
    const secondaryColor: [number, number, number] = [107, 114, 128]; // Gray 500
    const white: [number, number, number] = [255, 255, 255];
    const lightGray: [number, number, number] = [229, 231, 235];

    // --- 1. Header & Brand ---
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("INVOICE", 14, 25);

    doc.setFontSize(12);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text("Handyman Service", 140, 20);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("GSTIN: 21AAAAA0000A1Z5", 140, 26);
    doc.text("Bhubaneswar, Odisha, 751024", 140, 31);
    doc.text("support@handyman.com", 140, 36);

    // Divider Line
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.line(14, 42, 196, 42);

    // --- 2. Billing Details Section ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("BILLED TO", 14, 52);
    
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${order.customerDetails.name || 'Valued Customer'}`, 14, 58);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    
    // Auto-wrap long addresses
    const address = order.customerDetails.address || "No address provided";
    const splitAddress = doc.splitTextToSize(address, 70);
    doc.text(splitAddress, 14, 63);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE DETAILS", 140, 52);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No:  #${order.orderId.toUpperCase()}`, 140, 58);
    doc.text(`Date:            ${date}`, 140, 63);
    doc.text(`Payment:      Online (Success)`, 140, 68);

    // --- 3. Items Table ---
    const tableRows = order.items.map((item: any) => [
        item.name,
        '1',
        `INR ${item.price.toLocaleString('en-IN')}.00`,
        `INR ${item.price.toLocaleString('en-IN')}.00`
    ]);

    autoTable(doc, {
        startY: 85,
        head: [['Service Description', 'Qty', 'Unit Price', 'Total']],
        body: tableRows,
        theme: 'grid',
        headStyles: {
            fillColor: primaryColor,
            textColor: white,
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'left'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: primaryColor,
            cellPadding: 5
        },
        columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' }
        },
        styles: {
            lineColor: lightGray,
            lineWidth: 0.1
        }
    });

    // --- 4. Summary Calculation Area ---
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const summaryX = 140;
    const valueX = 196;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    
    doc.text("Subtotal:", summaryX, finalY);
    doc.text(`INR ${(order.totalAmount - (order.serviceFee || 49)).toLocaleString('en-IN')}.00`, valueX, finalY, { align: 'right' });

    doc.text("Convenience Fee:", summaryX, finalY + 7);
    doc.text(`INR ${(order.serviceFee || 49).toLocaleString('en-IN')}.00`, valueX, finalY + 7, { align: 'right' });

    // Final Total Box
    doc.setFillColor(243, 246, 255); // Light Blue Background
    doc.rect(summaryX - 5, finalY + 12, 61, 12, 'F');
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text("Total Paid:", summaryX, finalY + 20);
    doc.text(`INR ${order.totalAmount.toLocaleString('en-IN')}.00`, valueX, finalY + 20, { align: 'right' });

    // --- 5. Footer & Terms ---
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Terms & Conditions:", 14, pageHeight - 35);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("1. Computer-generated invoice; no signature required.", 14, pageHeight - 30);
    doc.text("2. Warranty as per selected service terms.", 14, pageHeight - 26);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text("Thank you for choosing Handyman!", 105, pageHeight - 15, { align: 'center' });

    // --- 6. Save PDF ---
    doc.save(`Invoice_${order.orderId.toUpperCase()}.pdf`);
};