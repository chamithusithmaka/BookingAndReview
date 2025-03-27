import React from "react";
import { Link } from "react-router-dom";
import NotificationIcon from "../Bookings/Ntification"; // Import the NotificationIcon component

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            EasyRide
          </Link>
          <button
            className="navbar-toggler"
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
              <li className="nav-item">
                <Link className="nav-link" to="/vehicles">
                  Vehicles
                </Link>
              </li>
              <li className="nav-item">
                {/* Notification Icon */}
                <NotificationIcon />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;