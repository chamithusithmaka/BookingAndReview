import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";

const NotificationIcon = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Hardcoded userId for now
  const userId = "12345";

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/api/booking/notifications/${userId}`);
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.post(`http://localhost:5000/api/booking/notifications/mark-all-read/${userId}`);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Mark single notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.post(`http://localhost:5000/api/booking/notifications/mark-read/${notificationId}`);
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId) => {
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

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="position-relative">
      {/* Notification Icon */}
      <div className="position-relative">
        <FontAwesomeIcon
          icon={faBell}
          className="fs-4 text-primary cursor-pointer"
          onClick={() => setShowPopup(!showPopup)}
          title="Notifications"
        />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Notification Popup */}
      {showPopup && (
        <div
          className="position-absolute bg-white shadow-lg rounded-3 border"
          style={{
            width: "500px",
            right: 0,
            zIndex: 1050,
            maxHeight: "700px",
            overflowY: "auto",
          }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
            <h5 className="mb-0">Notifications</h5>
            
          </div>

          {isLoading ? (
            <div className="d-flex justify-content-center p-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-muted text-center p-3">No notifications available.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`list-group-item d-flex justify-content-between align-items-start ${
                    notification.isRead ? "text-muted" : "bg-light"
                  }`}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{notification.message}</div>
                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                  </div>
                  <div>
                    
                    <button
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => deleteNotification(notification._id)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;