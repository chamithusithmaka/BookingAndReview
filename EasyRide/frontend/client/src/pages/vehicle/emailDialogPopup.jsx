import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { generateVehicleReport } from '../../components/Admin/vehicleReport'; // Adjust the import path as necessary

const VehicleReportEmailDialog = ({ show, onHide, vehicles }) => {
  const [formData, setFormData] = useState({
    to: '',
    subject: 'EasyRide Vehicle Inventory Report',
    message: 'Please find attached the latest vehicle inventory report from EasyRide.'
  });
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      // Generate base64 PDF document
      const pdfBase64 = await generateVehicleReport(vehicles, true);
      
      // Send email with PDF attachment
      const response = await axios.post('http://localhost:5000/api/email/send-report', {
        ...formData,
        reportData: pdfBase64,
        reportName: 'Vehicle_Inventory_Report.pdf',
        reportType: 'vehicle'
      });

      setStatus({
        loading: false,
        error: null,
        success: true
      });

      // Reset form after successful submission
      setTimeout(() => {
        if (status.success) {
          onHide();
          setStatus({ loading: false, error: null, success: false });
        }
      }, 2000);
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || 'Failed to send email. Please try again.',
        success: false
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Email Vehicle Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {status.error && (
          <Alert variant="danger">{status.error}</Alert>
        )}
        
        {status.success && (
          <Alert variant="success">Report sent successfully!</Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Recipient Email</Form.Label>
            <Form.Control
              type="email"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="recipient@example.com"
              required
              disabled={status.loading || status.success}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={status.loading || status.success}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              required
              disabled={status.loading || status.success}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={onHide} disabled={status.loading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={status.loading || status.success}>
              {status.loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Sending...
                </>
              ) : "Send Report"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default VehicleReportEmailDialog;