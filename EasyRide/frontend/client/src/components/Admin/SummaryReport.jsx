import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminSidebar from "./AdminSidebar";
import { faSpinner, faCheck, faClock, faBan, faDollarSign, faDownload } from "@fortawesome/free-solid-svg-icons";
import { generateSummaryReportPDF } from "./generateSummaryReport"; // Import the utility function

const SummaryReport = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/booking/allBookings");
        setBookings(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch booking data. Please try again later.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-primary" />
        <p className="ms-3">Loading summary report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center">
        <p>{error}</p>
      </div>
    );
  }

  // Calculate summary data
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((booking) => booking.status === "completed").length;
  const pendingBookings = bookings.filter((booking) => booking.status === "pending").length;
  const canceledBookings = bookings.filter((booking) => booking.status === "canceled").length;
  const totalRevenue = bookings
    .filter((booking) => booking.status === "completed")
    .reduce((sum, booking) => sum + booking.total_price, 0);

  // Prepare summary data for PDF generation
  const summaryData = {
    totalBookings,
    completedBookings,
    pendingBookings,
    canceledBookings,
    totalRevenue,
  };

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="container py-5">
        <h1 className="text-center text-primary mb-4">📊 Summary Report</h1>

        <div className="row g-4">
          {/* Total Bookings */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Total Bookings</h5>
                <h2 className="text-primary">{totalBookings}</h2>
              </div>
            </div>
          </div>

          {/* Completed Bookings */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Completed Bookings</h5>
                <h2 className="text-success">
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  {completedBookings}
                </h2>
              </div>
            </div>
          </div>

          {/* Pending Bookings */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Pending Bookings</h5>
                <h2 className="text-warning">
                  <FontAwesomeIcon icon={faClock} className="me-2" />
                  {pendingBookings}
                </h2>
              </div>
            </div>
          </div>

          {/* Canceled Bookings */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Canceled Bookings</h5>
                <h2 className="text-danger">
                  <FontAwesomeIcon icon={faBan} className="me-2" />
                  {canceledBookings}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title">Total Revenue</h5>
                <h2 className="text-success">
                  <FontAwesomeIcon icon={faDollarSign} className="me-2" />
                  ${totalRevenue.toFixed(2)}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={() => generateSummaryReportPDF(summaryData)}>
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryReport;