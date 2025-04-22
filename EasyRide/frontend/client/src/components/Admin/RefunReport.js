import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateRefundReport = (refunds) => {
  // Create new document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add background header
  doc.setFillColor(40, 167, 69); // Bootstrap green
  doc.rect(0, 0, 210, 40, 'F');
  
  // Add logo (if you have one)
  // doc.addImage('logo.png', 'PNG', 15, 10, 30, 20);
  
  // Add title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('REFUND REPORT', 105, 20, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(240, 240, 240);
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Generated on ${reportDate}`, 105, 28, { align: 'center' });
  
  // Add company info box
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(15, 45, 180, 25, 3, 3, 'F');
  
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('EasyRide Car Rentals', 20, 55);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Rental Avenue, Colombo 07', 20, 62);
  doc.text('info@easyride.com | +94 11 234 5678', 20, 67);
  
  // Calculate summary data
  const totalAmount = refunds.reduce((sum, refund) => sum + parseFloat(refund.refundAmount), 0).toFixed(2);
  const averageRefund = (totalAmount / (refunds.length || 1)).toFixed(2);
  
  // Add summary box on the right
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(120, 45, 75, 25, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SUMMARY', 158, 53, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Total Refunds: ${refunds.length}`, 125, 60);
  doc.text(`Total Amount: $${totalAmount}`, 125, 66);
  
  // Add table with data
  const tableColumn = [
    'No.',
    'User',
    'Booking ID',
    'Amount ($)',
    'Date',
    'Note'
  ];
  
  const tableRows = [];
  
  refunds.forEach((refund, index) => {
    const formattedDate = new Date(refund.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    
    const refundData = [
      index + 1,
      refund.userName,
      refund.bookingId.substring(0, 8) + '...',
      parseFloat(refund.refundAmount).toFixed(2),
      formattedDate,
      (refund.refundNote || 'N/A').substring(0, 15) + (refund.refundNote && refund.refundNote.length > 15 ? '...' : '')
    ];
    tableRows.push(refundData);
  });
  
  // Use autoTable directly with more modern styling
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 80,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [40, 167, 69], // Bootstrap green
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250], // Very light gray
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 }, // No.
      1: { cellWidth: 35 }, // User
      2: { cellWidth: 35 }, // Booking ID
      3: { halign: 'right', cellWidth: 25 }, // Amount
      4: { halign: 'center', cellWidth: 30 }, // Date
    },
    didDrawPage: (data) => {
      // Add footer to each page
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = data.pageNumber;
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${currentPage} of ${pageCount}`, 105, 290, { align: 'center' });
      doc.text('© 2025 EasyRide Car Rentals - All Rights Reserved', 105, 295, { align: 'center' });
    }
  });
  
  // Confidentiality notice at the bottom of the last page
  doc.setPage(doc.internal.getNumberOfPages());
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('CONFIDENTIAL: This report contains sensitive financial information and is intended for authorized personnel only.', 
          105, 280, { align: 'center' });
  
  // Add timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  doc.save(`refund-report-${timestamp}.pdf`);
  
  return true;
};