import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Hero from "../../components/vehicles/Hero";
import Navigation from "../../components/vehicles/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faSpinner, faCar, faCalendarCheck, faTag } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [topRatedVehicles, setTopRatedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopRatedVehicles = async () => {
      try {
        setLoading(true);
        
        // Fetch all vehicles
        const vehiclesResponse = await axios.get("http://localhost:5000/api/vehicles");
        const allVehicles = vehiclesResponse.data.data || [];
        
        // Fetch all reviews
        const reviewsResponse = await axios.get("http://localhost:5000/api/booking/reviews");
        
        // Check the data structure and ensure we get an array
        let allReviews = [];
        if (reviewsResponse.data) {
          // Check if the response has a data property that contains the array
          if (Array.isArray(reviewsResponse.data)) {
            allReviews = reviewsResponse.data;
          } else if (reviewsResponse.data.data && Array.isArray(reviewsResponse.data.data)) {
            allReviews = reviewsResponse.data.data;
          } else if (reviewsResponse.data.reviews && Array.isArray(reviewsResponse.data.reviews)) {
            allReviews = reviewsResponse.data.reviews;
          }
        }
        
        console.log("Reviews fetched:", allReviews);
        
        // Calculate average ratings for each vehicle
        const vehiclesWithRatings = allVehicles.map(vehicle => {
          const vehicleReviews = allReviews.filter(review => 
            review && review.vehicleId === vehicle._id
          );
          
          const totalRating = vehicleReviews.reduce((sum, review) => 
            sum + (review ? review.rating : 0), 0
          );
          
          const avgRating = vehicleReviews.length > 0 
            ? totalRating / vehicleReviews.length 
            : 0;
            
          const reviewCount = vehicleReviews.length;
          
          return {
            ...vehicle,
            avgRating,
            reviewCount
          };
        });
        
        // Sort by average rating (highest first)
        const sorted = vehiclesWithRatings.sort((a, b) => b.avgRating - a.avgRating);
        
        // Get top 3 rated vehicles
        const top3 = sorted.slice(0, 3);
        
        setTopRatedVehicles(top3);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching top rated vehicles:", err);
        setError("Failed to load top rated vehicles");
        setLoading(false);
      }
    };

    fetchTopRatedVehicles();
  }, []);

  // Render star rating component
  const StarRating = ({ rating }) => {
    return (
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`${star <= Math.round(rating) ? "text-warning" : "text-gray-300"} me-1`}
          />
        ))}
        <span className="ms-1 text-dark fw-medium">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="bg-light min-vh-100">
      <Navigation />
      <Hero />
      
      {/* Top Rated Vehicles Section */}
      <div className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-6 mx-auto text-center">
              <h2 className="display-5 fw-bold mb-3 text-primary">Featured Vehicles</h2>
              <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                <div className="bg-primary" style={{ height: "3px", width: "30px" }}></div>
                <FontAwesomeIcon icon={faStar} className="text-warning" />
                <div className="bg-primary" style={{ height: "3px", width: "30px" }}></div>
              </div>
              <p className="text-muted lead">Explore our highest-rated vehicles with exceptional customer satisfaction</p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-grow text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="lead text-muted">Discovering top-rated vehicles for you...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger p-4 rounded-3 shadow-sm">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{error}</div>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {topRatedVehicles.length > 0 ? (
                topRatedVehicles.map((vehicle) => (
                  <div key={vehicle._id} className="col-lg-4 col-md-6">
                    <div className="card border-0 h-100 shadow-sm rounded-4 overflow-hidden transition-all hover-scale">
                      <div className="position-relative">
                        <img
                          src={vehicle.image || "https://via.placeholder.com/600x400"}
                          className="card-img-top"
                          alt={vehicle.vehicleName}
                          style={{ height: "240px", objectFit: "cover" }}
                        />
                        {!vehicle.availability && (
                          <div className="position-absolute top-0 end-0 m-3">
                            <span className="badge bg-danger fw-medium px-3 py-2 rounded-pill shadow-sm">
                              Currently Unavailable
                            </span>
                          </div>
                        )}
                        <div className="position-absolute bottom-0 start-0 w-100 p-3" 
                          style={{ 
                            background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                            backdropFilter: "blur(5px)"
                          }}>
                          <h5 className="text-white fw-bold mb-0">{vehicle.vehicleName}</h5>
                          <div className="mt-2">
                            <StarRating rating={vehicle.avgRating} />
                          </div>
                        </div>
                      </div>
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="text-muted d-flex align-items-center">
                            <FontAwesomeIcon icon={faCar} className="me-2 text-primary" />
                            {vehicle.brand} {vehicle.model}
                          </span>
                          <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                            {vehicle.year}
                          </span>
                        </div>
                        
                        <div className="mb-3 d-flex">
                          <span className="badge bg-light text-dark px-3 py-2 rounded-pill me-2">
                            {vehicle.vehicleType}
                          </span>
                          <span className="text-muted small d-flex align-items-center">
                            <FontAwesomeIcon icon={faCalendarCheck} className="me-1 text-success" />
                            {vehicle.reviewCount} reviews
                          </span>
                        </div>
                        
                        <div className="d-flex align-items-center justify-content-between mb-4">
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faTag} className="text-primary me-2" />
                            <span className="h4 fw-bold text-primary mb-0">LKR {vehicle.pricePerDay}</span>
                          </div>
                          <span className="text-muted fw-light">per day</span>
                        </div>
                        
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate(`/bookings/${vehicle._id}`)}
                            disabled={!vehicle.availability}
                          >
                            Book Now
                          </button>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/vehicles/${vehicle._id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-5">
                  <div className="p-5 bg-white rounded-4 shadow-sm">
                    <img src="https://via.placeholder.com/150" alt="No vehicles" className="mb-4" style={{ opacity: 0.6 }} />
                    <h4 className="fw-bold text-secondary">No rated vehicles available yet</h4>
                    <p className="text-muted mb-4">Be the first to book and review our quality vehicles</p>
                    <button 
                      className="btn btn-primary btn-lg px-5 py-3 rounded-pill"
                      onClick={() => navigate("/vehicles")}
                    >
                      Explore All Vehicles
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-5">
            <button 
              className="btn btn-outline-primary btn-lg px-5 py-3 rounded-pill"
              onClick={() => navigate("/vehicles")}
            >
              View All Vehicles
            </button>
          </div>
        </div>
      </div>
      
      {/* Call to Action Section */}
      <div className="py-5 bg-primary text-white">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold mb-4">Ready for Your Next Adventure?</h2>
              <p className="lead mb-4">Discover our premium selection of vehicles and enjoy the freedom of the open road.</p>
              <button 
                className="btn btn-light btn-lg px-5 py-3 rounded-pill text-primary fw-bold"
                onClick={() => navigate("/vehicles")}
              >
                Book Your Dream Ride Today
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer placeholder - assuming you have a footer component */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 className="fw-bold mb-3">Vehicle Booking System</h5>
              <p className="text-muted">Your trusted partner for quality vehicle rentals.</p>
            </div>
            
          </div>
          <div className="border-top border-secondary mt-4 pt-4 text-center">
            <p className="text-muted small mb-0">© {new Date().getFullYear()} Vehicle Booking System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;