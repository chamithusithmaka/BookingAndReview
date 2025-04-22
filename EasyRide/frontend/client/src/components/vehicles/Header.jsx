import React from "react";
import { Link } from "react-router-dom";
import NotificationIcon from "../Bookings/Ntification"; // Import the NotificationIcon component

const Header = () => {
  return (
    <header className="sticky-top shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <div className="me-2 d-flex justify-content-center align-items-center bg-primary rounded-circle" style={{ width: "40px", height: "40px" }}>
              <i className="bi bi-car-front text-white"></i>
            </div>
            <span className="fw-bold fs-4">Easy<span className="text-primary">Ride</span></span>
          </Link>
          
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item mx-1">
                <Link className="nav-link px-3 py-2 rounded-pill fw-medium" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link className="nav-link px-3 py-2 rounded-pill fw-medium" to="/vehicles">
                  Vehicles
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link className="nav-link px-3 py-2 rounded-pill fw-medium" to="/about">
                  About Us
                </Link>
              </li>
              <li className="nav-item mx-1">
                <Link className="nav-link px-3 py-2 rounded-pill fw-medium" to="/contact">
                  Contact
                </Link>
              </li>
              <li className="nav-item ms-2">
                {/* Notification Icon - preserving the original component */}
                <NotificationIcon />
              </li>
              <li className="nav-item ms-3">
                <Link className="btn btn-primary rounded-pill px-4 fw-medium" to="/login">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;