import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * @route POST api/email/send-notification
 * @desc Send email notification
 * @access Public
 */
router.post('/send-notification', async (req, res) => {
  try {
    const { to, subject, message, bookingId } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide recipient email, subject, and message' 
      });
    }

    // Create transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // HTML template for email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center;">
          <h1>EasyRide Notification</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>${message}</p>
          ${bookingId ? `<p>Booking ID: <strong>${bookingId}</strong></p>` : ''}
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p>Thank you for choosing EasyRide!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </div>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"EasyRide" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
      html: htmlContent
    });

    console.log(`Email sent: ${info.messageId}`);

    res.status(200).json({ 
      success: true, 
      message: 'Email notification sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error in email route:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email notification', 
      error: error.message 
    });
  }
});

/**
 * @route POST api/email/booking-confirmation
 * @desc Send booking confirmation email
 * @access Public
 */
router.post('/booking-confirmation', async (req, res) => {
  try {
    const { 
      to, 
      bookingId, 
      vehicleName,
      pickupDate,
      returnDate,
      totalPrice 
    } = req.body;

    if (!to || !bookingId || !vehicleName || !pickupDate || !returnDate || !totalPrice) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required booking details' 
      });
    }

    // Create transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // HTML template for booking confirmation
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center;">
          <h1>Booking Confirmation</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>Dear Customer,</p>
          <p>Your booking has been confirmed. Here are your booking details:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Vehicle:</strong> ${vehicleName}</p>
            <p><strong>Pick-up Date:</strong> ${new Date(pickupDate).toLocaleDateString()}</p>
            <p><strong>Return Date:</strong> ${new Date(returnDate).toLocaleDateString()}</p>
            <p><strong>Total Price:</strong> LKR ${totalPrice}</p>
          </div>
          
          <p>If you need to make any changes to your booking, please contact our customer service.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p>Thank you for choosing EasyRide!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </div>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"EasyRide" <${process.env.EMAIL_USER}>`,
      to,
      subject: `EasyRide Booking Confirmation - ${bookingId}`,
      html: htmlContent
    });

    console.log(`Booking confirmation email sent: ${info.messageId}`);

    res.status(200).json({ 
      success: true, 
      message: 'Booking confirmation email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send booking confirmation email', 
      error: error.message 
    });
  }
});

/**
 * @route POST api/email/contact-form
 * @desc Send email from contact form
 * @access Public
 */
router.post('/contact-form', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields'
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // HTML for contact form email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center;">
          <h1>New Contact Form Submission</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
          
          <p>This message was sent through the EasyRide contact form.</p>
        </div>
      </div>
    `;

    // Send email to admin
    const info = await transporter.sendMail({
      from: `"EasyRide Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to admin email
      replyTo: email, // Allow admin to reply directly to the sender
      subject: `Contact Form: ${subject}`,
      html: htmlContent
    });

    // Send acknowledgment email to user
    const userInfo = await transporter.sendMail({
      from: `"EasyRide" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thank you for contacting EasyRide`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center;">
            <h1>Message Received</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
            <p>Dear ${name},</p>
            <p>Thank you for contacting EasyRide. We have received your message and will get back to you shortly.</p>
            <p>For your reference, here's a copy of your message:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Subject:</strong> ${subject}</p>
              <p>${message}</p>
            </div>
            
            <p>If your inquiry requires immediate assistance, please call our customer service at +94 123 456 789.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p>Best regards,</p>
              <p>The EasyRide Team</p>
            </div>
          </div>
        </div>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully'
    });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

/**
 * @route POST api/email/send-report
 * @desc Send email with PDF report attachment
 * @access Public
 */
router.post('/send-report', async (req, res) => {
  try {
    const { to, subject, message, reportData, reportName, reportType } = req.body;

    if (!to || !subject || !message || !reportData || !reportName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields for sending report' 
      });
    }

    // Check if reportData is base64
    if (!reportData.includes('base64')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report data format'
      });
    }
    
    // Extract base64 data (remove the data URL prefix)
    const base64Data = reportData.split('base64,')[1];

    // Create transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Determine report type for email template
    let reportTitle = 'Report';
    let reportColor = '#1a73e8'; // Default blue
    
    switch (reportType) {
      case 'vehicle':
        reportTitle = 'Vehicle Inventory Report';
        reportColor = '#0d6efd'; // Bootstrap primary blue
        break;
      case 'refund':
        reportTitle = 'Refund Report';
        reportColor = '#198754'; // Bootstrap success green
        break;
      case 'booking':
        reportTitle = 'Booking Report';
        reportColor = '#6610f2'; // Bootstrap purple
        break;
      default:
        reportTitle = 'EasyRide Report';
    }

    // HTML template for email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: ${reportColor}; color: white; padding: 20px; text-align: center;">
          <h1>${reportTitle}</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <p>${message}</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Attached:</strong> ${reportName}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p>Thank you for using EasyRide!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </div>
    `;

    // Send email with attachment
    const info = await transporter.sendMail({
      from: `"EasyRide Reports" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
      html: htmlContent,
      attachments: [
        {
          filename: reportName,
          content: base64Data,
          encoding: 'base64'
        }
      ]
    });

    console.log(`Email with report sent: ${info.messageId}`);

    res.status(200).json({ 
      success: true, 
      message: 'Report sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending report email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send report', 
      error: error.message 
    });
  }
});

export default router;