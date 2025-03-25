import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReviewSection from "../components/reviews/ReviewSection";

const VehicleDetailPage = () => {
  const { id } = useParams(); // Vehicle ID from URL
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [hasBooked, setHasBooked] = useState(false);
  const userId = "12345"; // Assume logged-in user ID (replace with real authentication)

  useEffect(() => {
    // Fetch vehicle details
    fetch(`http://localhost:5000/api/vehicles/${id}`)
      .then((res) => res.json())
      .then((data) => setVehicle(data))
      .catch((error) => console.error("Error fetching vehicle:", error));

    // Fetch reviews
    fetch(`http://localhost:5000/api/reviews/${id}`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));

    // Check if the user has completed a booking
    fetch(`http://localhost:5000/api/bookings/check/${userId}/${id}`)
      .then((res) => res.json())
      .then((data) => setHasBooked(data.hasBooked))
      .catch((error) => console.error("Error checking booking:", error));
  }, [id, userId]);

  if (!vehicle) return <p>Loading vehicle details...</p>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img src={vehicle.image} alt={vehicle.name} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h2>{vehicle.name}</h2>
          <p>{vehicle.description}</p>
          <h4>${vehicle.price} per day</h4>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection reviews={reviews} vehicleId={id} userId={userId} hasBooked={hasBooked} />
    </div>
  );
};

export default VehicleDetailPage;
