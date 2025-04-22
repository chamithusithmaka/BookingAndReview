// Update RefundManagement.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faTrash,
  faSpinner,
  faSearch,
  faExclamationCircle,
  faFilter,
  faCalendarAlt,
  faFilePdf,
  faDownload
} from "@fortawesome/free-solid-svg-icons";
import { generateRefundReport } from "./RefunReport";

const RefundManagement = () => {
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all refunds
  const fetchRefunds = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/refunds");
      setRefunds(response.data);
      setFilteredRefunds(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching refunds:", error);
      setLoading(false);
    }
  };

  // Handle filtering
  useEffect(() => {
    let result = refunds;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (refund) =>
          refund.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          refund.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRefunds(result);
  }, [searchTerm, refunds]);

  // Delete a refund by ID
  const deleteRefund = async (id) => {
    if (window.confirm("Are you sure you want to delete this refund?")) {
      try {
        await axios.delete(`http://localhost:5000/api/refunds/${id}`);
        alert("Refund deleted successfully!");
        fetchRefunds(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting refund:", error);
        alert("Failed to delete refund. Please try again.");
      }
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle download PDF
  const handleDownloadPDF = () => {
    generateRefundReport(filteredRefunds);
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-primary mb-3" />
            <h4 className="text-muted">Loading refunds...</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <div className="vh-100 bg-dark text-white position-fixed" style={{ width: "250px" }}>
        <AdminSidebar />
      </div>
      <div className="container mt-5" style={{ marginLeft: "250px" }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
          <h1 className="h2 mb-0 fw-bold d-flex align-items-center">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-success me-3" />
            Refund Management
          </h1>

          <div className="d-flex align-items-center">
            <button 
              className="btn btn-success me-3" 
              onClick={handleDownloadPDF}
              disabled={filteredRefunds.length === 0}
            >
              <FontAwesomeIcon icon={faFilePdf} className="me-2" />
              Download Report
            </button>

            <div className="search-wrapper position-relative me-2">
              <input
                type="text"
                className="form-control form-control-sm ps-4"
                placeholder="Search refunds..."
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
          </div>
        </div>

        {filteredRefunds.length === 0 ? (
          <div className="card shadow-sm border-0 p-5">
            <div className="text-center py-5">
              <FontAwesomeIcon icon={faExclamationCircle} size="3x" className="text-secondary mb-3" />
              <h4 className="text-muted">No refunds found matching your search</h4>
              {searchTerm ? (
                <button
                  className="btn btn-outline-primary mt-3"
                  onClick={() => {
                    setSearchTerm("");
                  }}
                >
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  Clear Filters
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="bg-light">
                    <th className="py-3 px-4" style={{ minWidth: "50px" }}>#</th>
                    <th className="py-3 px-4" style={{ minWidth: "180px" }}>User</th>
                    <th className="py-3 px-4" style={{ minWidth: "150px" }}>Booking ID</th>
                    <th className="py-3 px-4" style={{ minWidth: "120px" }}>Amount</th>
                    <th className="py-3 px-4" style={{ minWidth: "150px" }}>Note</th>
                    <th className="py-3 px-4" style={{ minWidth: "150px" }}>Date</th>
                    <th className="py-3 px-4 text-center" style={{ minWidth: "100px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRefunds.map((refund, index) => (
                    <tr key={refund._id}>
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="avatar rounded-circle bg-light d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <span className="text-success fw-bold">{refund.userName.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="ms-3">
                            <p className="fw-bold mb-0">{refund.userName}</p>
                            <small className="text-muted text-truncate d-block" style={{ maxWidth: "150px" }}>
                              {refund.userId}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-truncate" style={{ maxWidth: "150px" }}>
                        {refund.bookingId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="fw-bold text-success">${parseFloat(refund.refundAmount).toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {refund.refundNote || "N/A"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-2" />
                          {formatDate(refund.createdAt)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteRefund(refund._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer bg-white py-3 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <p className="mb-0 text-muted">
                  Showing {filteredRefunds.length} of {refunds.length} refunds
                </p>
                <div>
                  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundManagement;