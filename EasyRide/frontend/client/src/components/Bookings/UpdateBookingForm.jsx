import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faCalendarPlus, 
  faCalendarMinus, 
  faPhone, 
  faMoneyBillWave,
  faSave,
  faTimes,
  faCalculator
} from "@fortawesome/free-solid-svg-icons";

const UpdateBookingForm = ({ booking, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: booking.name,
    pick_up_date: new Date(booking.pick_up_date),
    return_date: new Date(booking.return_date),
    phone_number: booking.phone_number,
    total_price: booking.total_price,
  });

  const [pricePerDay, setPricePerDay] = useState(booking.total_price / booking.no_of_dates);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate number of days between pickup and return
  const daysBetween = Math.ceil(
    (formData.return_date - formData.pick_up_date) / (1000 * 60 * 60 * 24)
  );

  // Calculate total price whenever dates change
  useEffect(() => {
    const calculateTotalPrice = () => {
      const pickUpDate = new Date(formData.pick_up_date);
      const returnDate = new Date(formData.return_date);

      if (pickUpDate && returnDate && returnDate > pickUpDate) {
        const no_of_days = Math.ceil((returnDate - pickUpDate) / (1000 * 60 * 60 * 24));
        const newTotalPrice = no_of_days * pricePerDay;
        setFormData((prevData) => ({
          ...prevData,
          total_price: newTotalPrice,
        }));
      }
    };

    calculateTotalPrice();
  }, [formData.pick_up_date, formData.return_date, pricePerDay]);

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

  const handleDateChange = (date, field) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.put(
        `http://localhost:5000/api/booking/update/${booking._id}`,
        formData
      );
      onUpdate(response.data.booking); // Update the booking in the parent component
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2">
      <div className="alert alert-info mb-4">
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faCalculator} className="me-3 fs-4" />
          <div>
            <h6 className="mb-1">Booking Summary</h6>
            <p className="mb-0 small">
              You're updating a {daysBetween}-day booking at ${pricePerDay.toFixed(2)} per day.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label fw-bold">
            <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
            Full Name
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-bold">
              <FontAwesomeIcon icon={faCalendarPlus} className="me-2 text-primary" />
              Pick-Up Date
            </label>
            <DatePicker
              selected={formData.pick_up_date}
              onChange={(date) => handleDateChange(date, "pick_up_date")}
              minDate={new Date()} // Disable past dates
              className="form-control form-control-lg"
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-bold">
              <FontAwesomeIcon icon={faCalendarMinus} className="me-2 text-primary" />
              Return Date
            </label>
            <DatePicker
              selected={formData.return_date}
              onChange={(date) => handleDateChange(date, "return_date")}
              minDate={formData.pick_up_date || new Date()} // Disable dates before pick-up date
              className="form-control form-control-lg"
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label fw-bold">
            <FontAwesomeIcon icon={faPhone} className="me-2 text-primary" />
            Phone Number
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
            maxLength={10}
          />
        </div>
        
        <div className="card border-0 bg-light mb-4">
          <div className="card-body">
            <label className="form-label fw-bold">
              <FontAwesomeIcon icon={faMoneyBillWave} className="me-2 text-success" />
              Price Details
            </label>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">Price per day:</span>
              <span>${pricePerDay.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted">Number of days:</span>
              <span>{daysBetween}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold">Total Price:</span>
              <span className="fs-4 fw-bold text-primary">${formData.total_price.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button 
            type="button" 
            className="btn btn-outline-secondary px-4" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary px-4"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Update Booking
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBookingForm;