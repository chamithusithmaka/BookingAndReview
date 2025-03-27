import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import VehicleReview from "../../components/reviews/VehicleReview"; // Import the VehicleReview component

const VehicleDetailPage = () => {
  const { id } = useParams(); // Get vehicle ID from URL
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      const url = `http://localhost:5000/api/vehicles/${id}`;

      try {
        const response = await axios.get(url);
        setVehicle(response.data.data); // Ensure you're accessing the correct property
        setLoading(false);
      } catch (err) {
        setError("Failed to load vehicle details.");
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  const handleBooking = () => {
    if (vehicle.availability) {
      navigate(`/bookings/${vehicle._id}`); // Navigate to the booking page
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  if (!vehicle) {
    return <p className="text-center">No vehicle found.</p>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Image Section */}
        <div className="col-md-6">
          <div className="card shadow-lg">
            <img
              src={vehicle.image || "https://via.placeholder.com/400"}
              alt={vehicle.vehicleName || "Vehicle"}
              className="img-fluid card-img-top"
            />
          </div>
        </div>

        {/* Vehicle Details Section */}
        <div className="col-md-6">
          <div className="card shadow-lg border-primary">
            <div className="card-body">
              <h2 className="card-title text-primary">{vehicle.vehicleName || "N/A"}</h2>
              <p className="card-text"><strong>Brand:</strong> {vehicle.brand || "N/A"}</p>
              <p className="card-text"><strong>Type:</strong> {vehicle.vehicleType || "N/A"}</p>
              <p className="card-text"><strong>Model:</strong> {vehicle.model || "N/A"} ({vehicle.year || "N/A"})</p>
              <p className="card-text"><strong>Fuel:</strong> {vehicle.fuelType || "N/A"}</p>
              <p className="card-text"><strong>Mileage:</strong> {vehicle.mileage || "N/A"} km</p>
              <p className="card-text"><strong>Seating:</strong> {vehicle.seating || "N/A"} seats</p>
              <p className="card-text"><strong>Doors:</strong> {vehicle.noOfDoors || "N/A"}</p>
              <p className="card-text"><strong>Transmission:</strong> {vehicle.transmission || "N/A"}</p>
              <p className="card-text">
                <strong>AC:</strong> {vehicle.ac !== undefined ? (vehicle.ac ? "Yes" : "No") : "N/A"}
              </p>
              <p className="card-text"><strong>License Plate:</strong> {vehicle.licensePlate || "N/A"}</p>
              
              {/* Price Per Day */}
              <h4 className="text-success">LKR {vehicle.pricePerDay || "N/A"} <small className="text-muted">per day</small></h4>
              <p className="card-text"><strong>Availability:</strong> {vehicle.availability !== undefined ? (vehicle.availability ? "Available" : "Not Available") : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Button */}
      <div className="row mt-4">
        <div className="col-12 text-center">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleBooking}
            disabled={!vehicle.availability} // Disable button if not available
          >
            {vehicle.availability ? "Book This Vehicle" : "Not Available"}
          </button>
        </div>
      </div>

      {/* Vehicle Reviews Section */}
      <div className="row mt-5">
        <div className="col-12">
          <VehicleReview vehicleId={id} /> {/* Pass the vehicle ID to the VehicleReview component */}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;