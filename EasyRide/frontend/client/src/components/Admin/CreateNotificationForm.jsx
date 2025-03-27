import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBell, 
  faInfoCircle, 
  faExclamationTriangle, 
  faCheckCircle,
  faSpinner,
  faTimes,
  faPaperPlane
} from "@fortawesome/free-solid-svg-icons";

const CreateNotificationForm = ({ userId, onClose, onNotificationCreated }) => {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !type) {
      setError("Please fill all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:5000/api/booking/createNotification", {
        userId,
        message,
        type,
      });
      onNotificationCreated(response.data.notification); // Notify parent component
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error creating notification:", error);
      setError("Failed to create notification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to get icon based on notification type
  const getNotificationIcon = (notificationType) => {
    switch (notificationType) {
      case "info":
        return <FontAwesomeIcon icon={faInfoCircle} className="text-info" />;
      case "warning":
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning" />;
      case "success":
        return <FontAwesomeIcon icon={faCheckCircle} className="text-success" />;
      default:
        return <FontAwesomeIcon icon={faBell} className="text-secondary" />;
    }
  };

  return (
    <form onSubmit={handleCreateNotification} className="bg-white">
      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          <div>{error}</div>
        </div>
      )}
      
      <div className="mb-4">
        <label htmlFor="notificationType" className="form-label fw-bold">
          Notification Type
        </label>
        <div className="d-flex gap-3 mb-2">
          {["info", "warning", "success"].map((notificationType) => (
            <div 
              key={notificationType}
              className={`notification-type-option flex-grow-1 p-3 rounded-3 text-center ${
                type === notificationType ? 'selected border border-2' : 'border'
              }`}
              style={{ 
                cursor: "pointer", 
                backgroundColor: type === notificationType ? 
                  notificationType === 'info' ? '#cfe2ff' : 
                  notificationType === 'warning' ? '#fff3cd' : 
                  '#d1e7dd' : 'white',
                borderColor: type === notificationType ? 
                  notificationType === 'info' ? '#0d6efd' : 
                  notificationType === 'warning' ? '#ffc107' : 
                  '#198754' : '#dee2e6'
              }}
              onClick={() => setType(notificationType)}
            >
              <div className="mb-2">
                {getNotificationIcon(notificationType)}
              </div>
              <div className="text-capitalize fw-bold">
                {notificationType}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="notificationMessage" className="form-label fw-bold">
          Notification Message
        </label>
        <textarea
          id="notificationMessage"
          className="form-control form-control-lg"
          placeholder="Enter the notification message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          required
        ></textarea>
        <div className="form-text">
          <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
          This message will be sent to the user.
        </div>
      </div>
      
      <div className="mb-4">
        <label className="form-label fw-bold">
          Recipient
        </label>
        <div className="p-3 bg-light rounded-3">
          <div className="d-flex align-items-center">
            <div className="avatar rounded-circle bg-primary d-flex align-items-center justify-content-center me-3"
              style={{ width: '40px', height: '40px' }}>
              <span className="text-white fw-bold">U</span>
            </div>
            <div className="overflow-hidden">
              <p className="mb-0 fw-bold">User</p>
              <small className="text-muted text-truncate d-block" style={{ maxWidth: '250px' }}>{userId}</small>
            </div>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-end gap-3 mt-4">
        <button 
          type="button" 
          className="btn btn-outline-secondary px-4" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary px-4" 
          disabled={isSubmitting || !message.trim() || !type}
        >
          {isSubmitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
              Sending...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
              Send Notification
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateNotificationForm;