import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateVehicleReport = (vehicles, returnBase64 = false) => {
  // Create new document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Add background header
  doc.setFillColor(0, 123, 255); // Bootstrap primary blue
  doc.rect(0, 0, 210, 40, 'F');
  
  // Add title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.text('VEHICLE INVENTORY REPORT', 105, 20, { align: 'center' });
  
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
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter(v => v.availability).length;
  const unavailableVehicles = totalVehicles - availableVehicles;
  const totalValue = vehicles.reduce((sum, vehicle) => sum + parseFloat(vehicle.pricePerDay || 0), 0).toFixed(2);
  
  // Vehicle types summary
  const vehicleTypes = {};
  vehicles.forEach(vehicle => {
    const type = vehicle.vehicleType || 'Unknown';
    vehicleTypes[type] = (vehicleTypes[type] || 0) + 1;
  });
  
  // Add summary box on the right
  doc.setFillColor(248, 249, 250);
  doc.roundedRect(120, 45, 75, 25, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SUMMARY', 158, 53, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Total Vehicles: ${totalVehicles}`, 125, 60);
  doc.text(`Available: ${availableVehicles} | Unavailable: ${unavailableVehicles}`, 125, 66);
  
  // Add vehicle type distribution chart
  let yPos = 85;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  doc.text('Vehicle Type Distribution', 20, yPos);
  yPos += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  // Create a bar chart of vehicle types
  Object.keys(vehicleTypes).forEach(type => {
    const count = vehicleTypes[type];
    const percentage = Math.round((count / totalVehicles) * 100);
    
    // Draw bar label
    doc.text(`${type}:`, 20, yPos);
    doc.text(`${count} (${percentage}%)`, 55, yPos);
    
    // Draw bar background
    doc.setFillColor(220, 220, 220);
    doc.rect(70, yPos - 4, 100, 5, 'F');
    
    // Draw actual bar
    doc.setFillColor(0, 123, 255); // Bootstrap primary blue
    doc.rect(70, yPos - 4, percentage, 5, 'F');
    
    yPos += 8;
  });
  
  // Add table with data
  const tableColumn = [
    'No.',
    'Vehicle Name',
    'Brand/Model',
    'Year',
    'Type',
    'Rate/Day',
    'Status'
  ];
  
  const tableRows = [];
  
  vehicles.forEach((vehicle, index) => {
    const vehicleData = [
      index + 1,
      vehicle.vehicleName || 'N/A',
      `${vehicle.brand || 'N/A'} ${vehicle.model || ''}`,
      vehicle.year || 'N/A',
      vehicle.vehicleType || 'N/A',
      `LKR ${vehicle.pricePerDay || 0}`,
      vehicle.availability ? 'Available' : 'Unavailable'
    ];
    tableRows.push(vehicleData);
  });
  
  // Use autoTable
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: yPos + 10,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: [0, 123, 255], // Bootstrap primary blue
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250], // Very light gray
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 }, // No.
      1: { cellWidth: 35 }, // Vehicle Name
      2: { cellWidth: 30 }, // Brand/Model
      3: { halign: 'center', cellWidth: 15 }, // Year
      4: { cellWidth: 25 }, // Type
      5: { halign: 'right', cellWidth: 25 }, // Rate/Day
      6: { halign: 'center', cellWidth: 25 }, // Status
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
  doc.text('CONFIDENTIAL: This inventory report is intended for authorized personnel only.', 
          105, 280, { align: 'center' });
  
  // Return base64 string if requested, otherwise save file
  if (returnBase64) {
    return doc.output('dataurlstring');
  } else {
    // Add timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    doc.save(`vehicle-inventory-${timestamp}.pdf`);
    return true;
  }
};