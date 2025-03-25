import React, { useEffect, useState } from "react";
import axios from "axios";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]); // Initialize as an empty array

  // Fetch all vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vehicles");
        console.log("API Response:", response.data); // Debug the API response
        setVehicles(response.data.data || []); // Use response.data.data if the API wraps the array in a "data" property
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const handleViewVehicle = (vehicleId) => {
    alert(`View details for vehicle ID: ${vehicleId}`);
    // You can navigate to a detailed vehicle page here using React Router
    // Example: navigate(`/vehicle/${vehicleId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Available Vehicles</h1>
      {vehicles.length === 0 ? (
        <p className="text-center text-gray-600">No vehicles available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="border border-gray-300 rounded-lg shadow-lg bg-white p-4"
            >
              <img
                src={vehicle.image}
                alt={vehicle.vehicleName}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">{vehicle.vehicleName}</h2>
              <p className="text-gray-600"><strong>Brand:</strong> {vehicle.brand}</p>
              <p className="text-gray-600"><strong>Price:</strong> ${vehicle.pricePerDay} / day</p>
              <p className="text-gray-600"><strong>Type:</strong> {vehicle.vehicleType}</p>
              <button
                onClick={() => handleViewVehicle(vehicle._id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vehicle;