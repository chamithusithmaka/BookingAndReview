import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaClipboardList, FaCar, FaBell, FaStar } from "react-icons/fa";

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="d-flex flex-column bg-dark text-white vh-100 p-3">
      <h3 className="text-center mb-4">Admin Panel</h3>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <Link
            to="/admin"
            className={`nav-link d-flex align-items-center text-white ${
              location.pathname === "/admin" ? "active bg-secondary" : ""
            }`}
          >
            <FaClipboardList className="me-2" />
            Bookings
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin/vehicles"
            className={`nav-link d-flex align-items-center text-white ${
              location.pathname === "/admin/vehicles" ? "active bg-secondary" : ""
            }`}
          >
            <FaCar className="me-2" />
            Vehicles
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin/notifications"
            className={`nav-link d-flex align-items-center text-white ${
              location.pathname === "/admin/notifications" ? "active bg-secondary" : ""
            }`}
          >
            <FaBell className="me-2" />
            Notifications
          </Link>
        </li>
        <li className="nav-item mb-3">
          <Link
            to="/admin/reviews"
            className={`nav-link d-flex align-items-center text-white ${
              location.pathname === "/admin/reviews" ? "active bg-secondary" : ""
            }`}
          >
            <FaStar className="me-2" />
            Reviews
          </Link>
        </li>

        <li className="nav-item mb-3">
          <Link
            to="/admin/report"
            className={`nav-link d-flex align-items-center text-white ${
              location.pathname === "/admin/report" ? "active bg-secondary" : ""
            }`}
          >
            <FaCar className="me-2" />
            Booking Report 
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;