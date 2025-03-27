import jsPDF from "jspdf";

export const generateSummaryReportPDF = (summaryData) => {
  const { totalBookings, completedBookings, pendingBookings, canceledBookings, totalRevenue } = summaryData;

  const doc = new jsPDF();
  
  // Add background color to header
  doc.setFillColor(52, 152, 219); // Blue color
  doc.rect(0, 0, 210, 30, "F");
  
  // Add logo placeholder (you can replace with your actual logo)
  doc.setFillColor(255, 255, 255);
  doc.circle(20, 15, 8, "F");
  doc.setTextColor(52, 152, 219);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("ER", 20, 15, null, null, "center");
  
  // Add title with white text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("SUMMARY REPORT", 105, 20, null, null, "center");
  
  // Add current date
  const today = new Date();
  doc.setFontSize(10);
  doc.text(`Generated on: ${today.toLocaleDateString()}`, 170, 10, null, null, "right");
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Add decorative element
  doc.setDrawColor(52, 152, 219);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Summary Data with improved visualization
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("BOOKING STATISTICS", 105, 45, null, null, "center");
  
  // Create a table-like structure
  const startY = 55;
  const lineHeight = 15;
  
  // Table headers
  doc.setFillColor(240, 240, 240);
  doc.rect(20, startY - 6, 170, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Metric", 30, startY);
  doc.text("Count", 160, startY);
  
  // Table data
  doc.setFont("helvetica", "normal");
  
  // Total Bookings
  doc.setFillColor(249, 249, 249);
  doc.rect(20, startY + (lineHeight * 0), 170, 10, "F");
  doc.text("Total Bookings", 30, startY + (lineHeight * 1));
  doc.text(totalBookings.toString(), 160, startY + (lineHeight * 1));
  
  // Completed Bookings
  doc.rect(20, startY + (lineHeight * 1), 170, 10, "F");
  doc.text("Completed Bookings", 30, startY + (lineHeight * 2));
  doc.setTextColor(46, 204, 113); // Green for completed
  doc.text(completedBookings.toString(), 160, startY + (lineHeight * 2));
  
  // Pending Bookings
  doc.setTextColor(0, 0, 0);
  doc.rect(20, startY + (lineHeight * 2), 170, 10, "F");
  doc.text("Pending Bookings", 30, startY + (lineHeight * 3));
  doc.setTextColor(243, 156, 18); // Orange for pending
  doc.text(pendingBookings.toString(), 160, startY + (lineHeight * 3));
  
  // Canceled Bookings
  doc.setTextColor(0, 0, 0);
  doc.rect(20, startY + (lineHeight * 3), 170, 10, "F");
  doc.text("Canceled Bookings", 30, startY + (lineHeight * 4));
  doc.setTextColor(231, 76, 60); // Red for canceled
  doc.text(canceledBookings.toString(), 160, startY + (lineHeight * 4));
  
  // Draw border around the table
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, startY - 6, 170, lineHeight * 4 + 10, "S");
  
  // Financial Summary
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("FINANCIAL SUMMARY", 105, startY + (lineHeight * 6), null, null, "center");
  
  // Create a revenue box with shadow effect
  const revenueBoxY = startY + (lineHeight * 7);
  
  // Shadow effect (light gray rectangle slightly offset)
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(23, revenueBoxY + 3, 164, 30, 5, 5, "F");
  
  // Main box
  doc.setFillColor(52, 152, 219);
  doc.roundedRect(20, revenueBoxY, 170, 30, 5, 5, "F");
  
  // Revenue text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("Total Revenue", 105, revenueBoxY + 12, null, null, "center");
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`$${totalRevenue.toFixed(2)}`, 105, revenueBoxY + 22, null, null, "center");
  
  // Add decorative elements
  doc.setDrawColor(52, 152, 219);
  doc.setLineWidth(0.5);
  doc.line(20, 240, 190, 240);
  
  // Footer with company info
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("EasyRide Vehicle Rental Services", 105, 250, null, null, "center");
  doc.text("www.easyride.com | support@easyride.com | +1-123-456-7890", 105, 257, null, null, "center");
  
  // Signature line
  doc.line(130, 275, 180, 275);
  doc.setFontSize(8);
  doc.text("Authorized Signature", 155, 280, null, null, "center");

  // Save the PDF
  doc.save("SummaryReport.pdf");
};