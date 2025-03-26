import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UpdateBookingForm = ({ booking, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: booking.name,
    pick_up_date: new Date(booking.pick_up_date),
    return_date: new Date(booking.return_date),
    phone_number: booking.phone_number,
    total_price: booking.total_price, // Initialize with the current total price
  });

  const [pricePerDay, setPricePerDay] = useState(booking.total_price / booking.no_of_dates); // Calculate cost per day

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
    try {
      const response = await axios.put(
        `http://localhost:5000/api/booking/update/${booking._id}`,
        formData
      );
      onUpdate(response.data.booking); // Update the booking in the parent component
      onClose(); // Close the popup
      alert("Booking updated successfully.");
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking. Please try again.");
    }
  };

  return (
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
          required
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
          required
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
        <label className="form-label">Total Price</label>
        <input
          type="text"
          className="form-control"
          name="total_price"
          value={`$${formData.total_price}`} // Display the updated total price
          readOnly
        />
      </div>
      <button type="submit" className="btn btn-primary me-2">
        Update Booking
      </button>
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        Close
      </button>
    </form>
  );
};

export default UpdateBookingForm;