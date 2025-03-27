import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faTrash, 
  faBell, 
  faSpinner, 
  faSearch, 
  faFilter,
  faInfoCircle, 
  faExclamationTriangle, 
  faCheckCircle,
  faCalendarAlt,
  faUser,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import AdminSidebar from "./AdminSidebar";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch all notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/booking/all");
        const notificationsData = response.data.notifications || [];
        setNotifications(notificationsData);
        setFilteredNotifications(notificationsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Handle filtering
  useEffect(() => {
    let result = notifications;
    
    // Filter by type
    if (typeFilter !== "all") {
      result = result.filter(notification => notification.type === typeFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        notification =>
          notification.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredNotifications(result);
  }, [typeFilter, searchTerm, notifications]);

  // Delete a notification
  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await axios.delete(`http://localhost:5000/api/booking/deleteNotify/${notificationId}`);
        setNotifications(notifications.filter((n) => n._id !== notificationId));
        alert("Notification deleted successfully.");
      } catch (error) {
        console.error("Error deleting notification:", error);
        alert("Failed to delete notification. Please try again.");
      }
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
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

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if the date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise, return the full date
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="container-fluid py-5 d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-primary mb-3" />
            <h4 className="text-muted">Loading notifications...</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="container-fluid py-4 px-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
          <h1 className="h2 mb-0 fw-bold d-flex align-items-center">
            <FontAwesomeIcon icon={faBell} className="text-primary me-3" />
            Notification Center
          </h1>

          <div className="d-flex align-items-center flex-grow-1 flex-md-grow-0 ms-md-3 mt-3 mt-md-0">
            <div className="search-wrapper position-relative me-2 me-md-3">
              <input
                type="text"
                className="form-control form-control-sm ps-4"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ minWidth: "200px" }}
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="position-absolute text-muted"
                style={{ left: "10px", top: "50%", transform: "translateY(-50%)" }}
              />
            </div>
            
            <select
              className="form-select form-select-sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
            </select>
          </div>
        </div>
        
        {filteredNotifications.length === 0 ? (
          <div className="card shadow-sm border-0 p-5">
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faEnvelope} size="3x" className="text-secondary mb-3" />
              <h4 className="text-muted">No notifications found</h4>
              {searchTerm || typeFilter !== "all" ? (
                <button 
                  className="btn btn-outline-primary mt-3"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("all");
                  }}
                >
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  Clear Filters
                </button>
              ) : (
                <p className="text-muted mt-2">No notifications have been created yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredNotifications.map((notification) => (
              <div className="col-md-6 col-xl-4 mb-4" key={notification._id}>
                <div className={`card h-100 shadow-sm hover-shadow border-start border-4 ${
                  notification.type === "info" ? "border-info" : 
                  notification.type === "warning" ? "border-warning" : 
                  notification.type === "success" ? "border-success" : "border-secondary"
                }`}>
                  <div className="card-header bg-transparent d-flex justify-content-between align-items-center py-3">
                    <div className="d-flex align-items-center">
                      <div className={`notification-icon rounded-circle p-2 me-2 ${
                        notification.type === "info" ? "bg-info bg-opacity-10" : 
                        notification.type === "warning" ? "bg-warning bg-opacity-10" : 
                        notification.type === "success" ? "bg-success bg-opacity-10" : "bg-secondary bg-opacity-10"
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <span className="badge bg-light text-dark text-capitalize">
                        {notification.type}
                      </span>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteNotification(notification._id)}
                      title="Delete Notification"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                        style={{ width: '40px', height: '40px' }}>
                        <FontAwesomeIcon icon={faUser} className="text-primary" />
                      </div>
                      <div>
                        <small className="text-muted d-block">Recipient</small>
                        <p className="mb-0 text-truncate" style={{ maxWidth: "200px" }}>
                          {notification.userId}
                        </p>
                      </div>
                    </div>
                    
                    <div className="notification-message p-3 bg-light rounded-3 mb-3">
                      {notification.message}
                    </div>
                    
                    <div className="d-flex align-items-center text-muted">
                      <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                      <small>{formatDate(notification.createdAt)}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="card mt-4 shadow-sm border-0">
          <div className="card-body d-flex justify-content-between align-items-center">
            <p className="mb-0 text-muted">
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </p>
            
            
            {/* Hidden button for demonstration - replace with your actual create notification functionality */}
            <button id="createNotificationBtn" className="d-none"></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;