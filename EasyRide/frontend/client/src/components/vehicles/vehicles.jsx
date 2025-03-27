import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Header from "./Header"; // Import the Header component

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate for routing

  // Fetch vehicles from the API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vehicles");
        setVehicles(response.data.data || []);
        setLoading(false);
        console.log("Vehicles:", response.data.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to load vehicles. Please try again later.");
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading vehicles...</p>;
  }

  if (error) {
    return <p className="text-center text-danger mt-5">{error}</p>;
  }

  if (vehicles.length === 0) {
    return <p className="text-center mt-5">No vehicles available.</p>;
  }

  const handleBooking = (vehicleId) => {
    // Navigate to the booking page with the vehicle ID
    navigate(`/bookings/${vehicleId}`);
  };

  return (
    <div>
      <Header />
      <div className="container py-5">
        <h1 className="text-center mb-4">Available Vehicles</h1>
        <div className="row g-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="card h-100">
                <img
                  src={vehicle.image}
                  className="card-img-top"
                  alt={vehicle.vehicleName}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{vehicle.vehicleName}</h5>
                  <p className="card-text">
                    <strong>Brand:</strong> {vehicle.brand}
                  </p>
                  <p className="card-text">
                    <strong>Type:</strong> {vehicle.vehicleType}
                  </p>
                  <p className="card-text">
                    <strong>Price/Day:</strong> ${vehicle.pricePerDay}
                  </p>
                  <p className="card-text">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        vehicle.availability ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {vehicle.availability ? "Available" : "Booked"}
                    </span>
                  </p>
                  <div className="d-flex gap-2 mt-3">
  <button
    className="btn btn-outline-primary"
    onClick={() => navigate(`/vehicles/${vehicle._id}`)}
  >
    View Details
  </button>
  {vehicle.availability && (
    <button
      className="btn btn-primary"
      onClick={() => handleBooking(vehicle._id)}
    >
      Book Now
    </button>
  )}
</div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vehicles;