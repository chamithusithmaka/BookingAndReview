import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import VehicleDetailPage from "./vehicleDetailPage";

const UserVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/vehicles")
      .then((response) => {
        setVehicles(response.data.data);
        setFilteredVehicles(response.data.data);
      })
      .catch((error) => console.error("Error fetching vehicles:", error));
  }, []);

  useEffect(() => {
    let filtered = vehicles;

    if (searchQuery) {
      filtered = filtered.filter(vehicle =>
        vehicle.vehicleName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (brandFilter) {
      filtered = filtered.filter(vehicle => vehicle.brand === brandFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter(vehicle => vehicle.vehicleType === typeFilter);
    }

    setFilteredVehicles(filtered);
  }, [searchQuery, brandFilter, typeFilter, vehicles]);

  const brands = [...new Set(vehicles.map(vehicle => vehicle.brand))];
  const types = [...new Set(vehicles.map(vehicle => vehicle.vehicleType))];

  return (
    <div className="container mt-4">
      <h2 className="text-center text-primary">Available Vehicles</h2>

      {/* Search and Filter Section */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by vehicle name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-control" value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
            <option value="">Filter by Brand</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-control" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">Filter by Type</option>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className="row">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <div key={vehicle._id} className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <img
                  src={vehicle.image || "https://via.placeholder.com/300"}
                  className="card-img-top"
                  alt={vehicle.vehicleName}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">{vehicle.vehicleName}</h5>
                  <p className="card-text">{vehicle.brand} - {vehicle.vehicleType}</p>
                  <p className="card-text text-muted">
                    {vehicle.pricePerDay} LKR / day 
                  </p>
                 
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted">No vehicles found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserVehicles;
