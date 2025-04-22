import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaTrash, FaEdit, FaPlus, FaDownload, FaEnvelope } from "react-icons/fa";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { generateVehicleReport } from "../../components/Admin/vehicleReport"; // Import the report generation function
import VehicleReportEmailDialog from "./emailDialogPopup"; // Import the email dialog component

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [formData, setFormData] = useState({
    vehicleName: "",
    brand: "",
    vehicleType: "",
    model: "",
    year: "",
    fuelType: "",
    mileage: "",
    seating: "",
    noOfDoors: "",
    transmission: "",
    ac: false,
    licensePlate: "",
    pricePerDay: "",
    availability: true,
    description: "",
    image: "",
  });
  const [editVehicle, setEditVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [showEmailDialog, setShowEmailDialog] = useState(false); // State for email dialog

  // Fetch vehicles from API
  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    // Filter vehicles based on search term
    setFilteredVehicles(
      vehicles.filter(
        (vehicle) =>
          vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, vehicles]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/vehicles");
      setVehicles(response.data.data);
      setFilteredVehicles(response.data.data); // Initialize filtered vehicles
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setError("Failed to load vehicles. Please try again.");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/vehicles", formData);
      setVehicles((prevVehicles) => [...prevVehicles, response.data.data]);
      setFormData({
        vehicleName: "",
        brand: "",
        vehicleType: "",
        model: "",
        year: "",
        fuelType: "",
        mileage: "",
        seating: "",
        noOfDoors: "",
        transmission: "",
        ac: false,
        licensePlate: "",
        pricePerDay: "",
        availability: true,
        description: "",
        image: "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
      setError("Failed to add vehicle. Please check your input.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setError("");
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle._id !== id));
      setLoading(false);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setError("Failed to delete vehicle. Please try again.");
      setLoading(false);
    }
  };

  const handleEditClick = (vehicle) => {
    setEditVehicle(vehicle);
    setFormData(vehicle);
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/vehicles/${editVehicle._id}`, formData);
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => (v._id === editVehicle._id ? { ...v, ...formData } : v))
      );
      setEditVehicle(null);
      setLoading(false);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      setError("Failed to update vehicle. Please try again.");
      setLoading(false);
    }
  };

  // Function to handle report generation
  const handleGenerateReport = () => {
    generateVehicleReport(vehicles);
  };

  return (
    <div className="d-flex">
      <div className="vh-100 bg-dark text-white position-fixed" style={{ width: "250px" }}>
        <AdminSidebar />
      </div>
      <div className="container mt-5" style={{ marginLeft: "250px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">🚗 Admin Panel - Manage Vehicles</h2>
          <div>
            <button 
              className="btn btn-outline-primary me-2"
              onClick={handleGenerateReport}
            >
              <FaDownload className="me-2" /> Download Report
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => setShowEmailDialog(true)}
            >
              <FaEnvelope className="me-2" /> Email Report
            </button>
          </div>
        </div>

        {/* Email Report Dialog */}
        <VehicleReportEmailDialog 
          show={showEmailDialog} 
          onHide={() => setShowEmailDialog(false)} 
          vehicles={vehicles}
        />

        {error && <div className="alert alert-danger">{error}</div>}

        {/* ADD VEHICLE FORM */}
        <div className="card shadow p-3 mb-4 bg-white rounded">
          <div className="card-body">
            <h5 className="card-title text-primary">Add a New Vehicle</h5>
            <form onSubmit={handleAddVehicle}>
              <div className="row">
                {Object.keys(formData).map((key) =>
                  key !== "availability" ? (
                    <div className="col-md-4 mb-3" key={key}>
                      <label className="form-label">{key.replace(/([A-Z])/g, " $1")}</label>
                      <input
                        type={["year", "mileage", "pricePerDay", "seating", "noOfDoors"].includes(key) ? "number" : "text"}
                        name={key}
                        className="form-control"
                        value={formData[key]}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  ) : (
                    <div className="col-md-4 mb-3" key={key}>
                      <label className="form-label">Availability</label>
                      <input type="checkbox" name="availability" checked={formData.availability} onChange={handleChange} />
                    </div>
                  )
                )}
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                <FaPlus /> {loading ? "Adding..." : "Add Vehicle"}
              </button>
            </form>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by vehicle name or brand"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* VEHICLES TABLE */}
        <div className="table-responsive">
          <table className="table table-hover table-striped shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Type</th>
                <th>Model</th>
                <th>Year</th>
                <th>Fuel</th>
                <th>Price/Day (LKR)</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle._id} className="align-middle">
                  <td>
                    <img
                      src={vehicle.image || "https://via.placeholder.com/100"}
                      alt="Vehicle"
                      style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                    />
                  </td>
                  <td>{vehicle.vehicleName}</td>
                  <td>{vehicle.brand}</td>
                  <td>{vehicle.vehicleType}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.year}</td>
                  <td>{vehicle.fuelType}</td>
                  <td>{vehicle.pricePerDay}</td>
                  <td>{vehicle.availability ? "Available" : "Not Available"}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(vehicle)}>
                      <FaEdit /> Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(vehicle._id)} disabled={loading}>
                      <FaTrash /> {loading ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editVehicle && (
          <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Vehicle</h5>
                  <button type="button" className="btn-close" onClick={() => setEditVehicle(null)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleUpdateVehicle}>
                    <div className="mb-3">
                      <label className="form-label">Vehicle Name</label>
                      <input
                        type="text"
                        name="vehicleName"
                        className="form-control"
                        value={formData.vehicleName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        className="form-control"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Availability</label>
                      <input
                        type="checkbox"
                        name="availability"
                        checked={formData.availability}
                        onChange={handleChange}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Updating..." : "Update Vehicle"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVehicles;