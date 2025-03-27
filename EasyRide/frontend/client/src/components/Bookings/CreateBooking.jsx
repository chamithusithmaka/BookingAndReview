import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VehicleReview from "../reviews/VehicleReview"; // Import the VehicleReview component

const BookingForm = () => {
  const { vehicleId } = useParams(); // Get the vehicle ID from the URL
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    pick_up_date: null,
    return_date: null,
    phone_number: "",
    additional_notes: "",
    paymentReceipt: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0); // To calculate and display total price

  // Fetch vehicle details
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}`);
        setVehicle(response.data.data);
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to load vehicle details.");
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate name field (only letters and spaces allowed)
    if (name === "name") {
      const regex = /^[a-zA-Z\s]*$/; // Allow only letters and spaces
      if (!regex.test(value)) {
        return; // Prevent invalid characters from being entered
      }
    }

    // Validate phone_number field (only digits, max 10 characters)
    if (name === "phone_number") {
      const regex = /^[0-9]*$/; // Allow only digits
      if (!regex.test(value) || value.length > 10) {
        return; // Prevent invalid characters or more than 10 digits
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  // Handle date changes
  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });

    // Calculate total price when dates are selected
    if (field === "pick_up_date" || field === "return_date") {
      calculateTotalPrice({ ...formData, [field]: date });
    }
  };

  // Handle file upload and convert to Base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, paymentReceipt: reader.result });
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  // Calculate total price based on selected dates
  const calculateTotalPrice = (data) => {
    const pickUpDate = data.pick_up_date;
    const returnDate = data.return_date;

    if (pickUpDate && returnDate && returnDate > pickUpDate) {
      const no_of_dates = Math.ceil((returnDate - pickUpDate) / (1000 * 60 * 60 * 24));
      setTotalPrice(no_of_dates * vehicle.pricePerDay);
    } else {
      setTotalPrice(0);
    }
  };

// Handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Validate dates
    const pickUpDate = formData.pick_up_date;
    const returnDate = formData.return_date;

    if (!pickUpDate || !returnDate) {
      setError("Both pick-up and return dates are required.");
      return;
    }

    if (returnDate <= pickUpDate) {
      setError("Return date must be after pick-up date.");
      return;
    }

    // Calculate the number of days
    const no_of_dates = Math.ceil((returnDate - pickUpDate) / (1000 * 60 * 60 * 24));

    // Include userId (hardcoded for now, will fetch from localStorage after login implementation)
    const userId = "12345"; // Hardcoded userId
    // Uncomment the following line after implementing login functionality
    // const userId = localStorage.getItem("userId");

    const bookingData = {
      ...formData,
      vehicleId,
      no_of_dates,
      total_price: totalPrice,
      userId,
    };

    const response = await axios.post("http://localhost:5000/api/booking/createBooking", bookingData);
    setMessage("Booking successful!");
    setError("");
    
    // Show success message for 1.5 seconds before navigating
    setTimeout(() => {
      window.location.href = "/"; // Redirect to home page
      // Alternatively, if using React Router:
      // navigate("/");
    }, 1500);
    
  } catch (err) {
    console.error("Error submitting booking:", err);
    setError("Failed to submit booking. Please try again.");
    setMessage("");
  }
};

  if (error) {
    return <p className="text-danger text-center mt-5">{error}</p>;
  }

  if (!vehicle) {
    return <p className="text-center mt-5">Loading vehicle details...</p>;
  }

  return (
    <div className="container py-5">
  <h1 className="text-center mb-5 display-6 fw-bold text-primary">Book {vehicle.vehicleName}</h1>
  
  {message && (
    <div className="alert alert-success text-center mb-4 shadow-sm" role="alert">
      {message}
    </div>
  )}
  
  {error && (
    <div className="alert alert-danger text-center mb-4 shadow-sm" role="alert">
      {error}
    </div>
  )}
  
  <div className="row g-4">
    {/* Vehicle Details */}
<div className="col-md-6">
  <div className="card border-0 shadow-lg overflow-hidden">
    <div className="position-relative">
      <img
        src={vehicle.image}
        className="card-img-top object-fit-cover"
        alt={vehicle.vehicleName}
        style={{ height: "350px", objectFit: "cover" }}
      />
      <div className="position-absolute end-0 bottom-0 m-3">
        <span
          className={`badge rounded-pill ${
            vehicle.availability ? "bg-success" : "bg-danger"
          } fs-6 px-3 py-2 shadow`}
        >
          <i className={`fas fa-${vehicle.availability ? "check-circle" : "times-circle"} me-1`}></i>
          {vehicle.availability ? "Available" : "Booked"}
        </span>
      </div>
    </div>
    
    <div className="card-body p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="card-title h3 mb-0">{vehicle.vehicleName}</h5>
          <p className="text-muted mb-0">
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </p>
        </div>
        <div className="text-end">
          <h6 className="text-primary fs-4 mb-0">${vehicle.pricePerDay}</h6>
          <small className="text-muted">per day</small>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-muted small mb-2">Description</p>
        <p className="mb-0">{vehicle.description}</p>
      </div>
      
      <hr className="my-4" />
      
      <h6 className="text-uppercase text-muted mb-3">Vehicle Specifications</h6>
      <div className="row g-3">
        <div className="col-6 col-lg-4">
          <div className="spec-item p-3 rounded bg-light">
            <div className="d-flex align-items-center">
              <i className="fas fa-car-side text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">Type</small>
                <span className="fw-bold">{vehicle.vehicleType}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-lg-4">
          <div className="spec-item p-3 rounded bg-light">
            <div className="d-flex align-items-center">
              <i className="fas fa-gas-pump text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">Fuel Type</small>
                <span className="fw-bold">{vehicle.fuelType}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-lg-4">
          <div className="spec-item p-3 rounded bg-light">
            <div className="d-flex align-items-center">
              <i className="fas fa-tachometer-alt text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">Mileage</small>
                <span className="fw-bold">{vehicle.mileage} km</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-lg-4">
          <div className="spec-item p-3 rounded bg-light">
            <div className="d-flex align-items-center">
              <i className="fas fa-user-friends text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">Seating</small>
                <span className="fw-bold">{vehicle.seating} seats</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-lg-4">
          <div className="spec-item p-3 rounded bg-light">
            <div className="d-flex align-items-center">
              <i className="fas fa-door-open text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">Doors</small>
                <span className="fw-bold">{vehicle.noOfDoors}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-lg-4">
          <div className="spec-item p-3 rounded bg-light">
            <div className="d-flex align-items-center">
              <i className="fas fa-cog text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">Transmission</small>
                <span className="fw-bold">{vehicle.transmission}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-lg-4">
          <div className="spec-item p-3 rounded bg-light">
            <div className="d-flex align-items-center">
              <i className={`fas fa-${vehicle.ac ? 'snowflake text-info' : 'times-circle text-danger'} me-2`}></i>
              <div>
                <small className="text-muted d-block">Air Conditioning</small>
                <span className="fw-bold">{vehicle.ac ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-lg-4">
          <div className="spec-item p-3 rounded bg-light">
            <div className="d-flex align-items-center">
              <i className="fas fa-id-card text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">License Plate</small>
                <span className="fw-bold">{vehicle.licensePlate}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-lg-4">
          <div className="spec-item p-3 rounded bg-light">
            <div className="d-flex align-items-center">
              <i className="fas fa-calendar-alt text-primary me-2"></i>
              <div>
                <small className="text-muted d-block">Year</small>
                <span className="fw-bold">{vehicle.year}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-2 text-end">
       
      </div>
    </div>
  </div>
</div>

    {/* Booking Form */}
    {/* Booking Form */}
<div className="col-md-6">
  <div className="card border-0 shadow-lg h-100">
    <div className="card-header bg-primary text-white py-3">
      <h5 className="mb-0">
        <i className="fas fa-calendar-check me-2"></i>
        Book This Vehicle
      </h5>
    </div>
    <div className="card-body p-4 d-flex flex-column">
      <form onSubmit={handleSubmit} className="flex-grow-1 d-flex flex-column">
        <div className="mb-3">
          <label className="form-label fw-bold">Full Name</label>
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-light text-primary">
              <i className="fas fa-user"></i>
            </span>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
        </div>
        
        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="form-label fw-bold">Pick-Up Date</label>
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-light text-primary">
                <i className="fas fa-calendar-plus"></i>
              </span>
              <DatePicker
                selected={formData.pick_up_date}
                onChange={(date) => handleDateChange(date, "pick_up_date")}
                minDate={new Date()}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select pick-up date"
              />
            </div>
          </div>
          <div className="col-6">
            <label className="form-label fw-bold">Return Date</label>
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-light text-primary">
                <i className="fas fa-calendar-minus"></i>
              </span>
              <DatePicker
                selected={formData.return_date}
                onChange={(date) => handleDateChange(date, "return_date")}
                minDate={formData.pick_up_date || new Date()}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select return date"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label fw-bold">Phone Number</label>
          <div className="input-group input-group-lg">
            <span className="input-group-text bg-light text-primary">
              <i className="fas fa-phone"></i>
            </span>
            <input
              type="text"
              className="form-control"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>
        </div>
        
        <div className="mb-3 flex-grow-1">
          <label className="form-label fw-bold">Additional Notes</label>
          <textarea
            className="form-control"
            name="additional_notes"
            style={{ minHeight: "80px", height: "100%" }}
            value={formData.additional_notes}
            onChange={handleChange}
            placeholder="Any special requests or information"
          ></textarea>
        </div>
        
        <div className="mb-3">
          <label className="form-label fw-bold">Payment Receipt</label>
          <div className="input-group">
            <span className="input-group-text bg-light text-primary">
              <i className="fas fa-receipt"></i>
            </span>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
          <small className="text-muted">Upload a screenshot of your payment confirmation</small>
        </div>
        
        <div className="price-summary bg-light p-3 rounded-3 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">Price per day:</span>
            <span>${vehicle.pricePerDay}</span>
          </div>
          
          {formData.pick_up_date && formData.return_date && (
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">Number of days:</span>
              <span>{Math.ceil((formData.return_date - formData.pick_up_date) / (1000 * 60 * 60 * 24))}</span>
            </div>
          )}
          
          <div className="d-flex justify-content-between align-items-center fw-bold">
            <span>Total Price:</span>
            <span className="text-primary fs-5">${totalPrice}</span>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-lg w-100 py-3 shadow-sm mt-auto"
          disabled={!formData.name || !formData.pick_up_date || !formData.return_date || !formData.phone_number || !formData.paymentReceipt}
        >
          <i className="fas fa-check-circle me-2"></i>
          Confirm Booking
        </button>
      </form>
    </div>
  </div>
</div>
  </div>

  {/* Vehicle Reviews */}
  <div className="mt-5">
    <VehicleReview vehicleId={vehicleId} />
  </div>
</div>
  );
};

export default BookingForm;