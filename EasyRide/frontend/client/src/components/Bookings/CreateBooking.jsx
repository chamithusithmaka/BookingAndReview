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
      <h1 className="text-center mb-4">Book {vehicle.vehicleName}</h1>
      {message && <p className="text-success text-center">{message}</p>}
      {error && <p className="text-danger text-center">{error}</p>}
      <div className="row">
        {/* Vehicle Details */}
        <div className="col-md-6">
          <div className="card">
            <img
              src={vehicle.image}
              className="card-img-top"
              alt={vehicle.vehicleName}
              style={{ height: "300px", objectFit: "cover" }}
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
                <strong>Description:</strong> {vehicle.description}
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
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Pick-Up Date</label>
              <DatePicker
                selected={formData.pick_up_date}
                onChange={(date) => handleDateChange(date, "pick_up_date")}
                minDate={new Date()} // Disable past dates
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Return Date</label>
              <DatePicker
                selected={formData.return_date}
                onChange={(date) => handleDateChange(date, "return_date")}
                minDate={formData.pick_up_date || new Date()} // Disable dates before pick-up date
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-control"
                name="additional_notes"
                rows="3"
                value={formData.additional_notes}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Payment Receipt</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Total Price</label>
              <input
                type="text"
                className="form-control"
                value={`$${totalPrice}`}
                readOnly
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Submit Booking
            </button>
          </form>
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