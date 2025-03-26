import Vehicle from '../models/vehicle.model.js';

// Create a new vehicle
export const createVehicle = async (req, res) => {
    try {
        const requiredFields = [
            "vehicleName", "brand", "model", "year", "fuelType", "mileage",
            "seating", "noOfDoors", "transmission", "ac", "pricePerDay",
            "availability", "description", "image"
        ];

        // Check for missing fields
        const missingFields = requiredFields.filter(field => req.body[field] === undefined);
        if (missingFields.length > 0) {
            return res.status(400).json({ success: false, message: `Missing fields: ${missingFields.join(", ")}` });
        }

        const newVehicle = new Vehicle(req.body);
        await newVehicle.save();

        res.status(201).json({ success: true, data: newVehicle });
    } catch (error) {
        console.error('Error creating vehicle:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
// Get all vehicles
export const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        console.error('Error fetching vehicles:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Get a single vehicle by ID
export const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
        res.status(200).json({ success: true, data: vehicle });
    } catch (error) {
        console.error('Error fetching vehicle:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Update vehicle details
export const updateVehicle = async (req, res) => {
    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
        res.status(200).json({ success: true, data: updatedVehicle });
    } catch (error) {
        console.error('Error updating vehicle:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Delete a vehicle
export const deleteVehicle = async (req, res) => {
    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!deletedVehicle) {
            return res.status(404).json({ success: false, message: 'Vehicle not found' });
        }
        res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Search vehicles by name, brand, or vehicle type
export const searchVehicles = async (req, res) => {
    try {
        const { name, brand, vehicleType } = req.query;
        let filters = {};

        if (name) filters.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        if (brand) filters.brand = { $regex: brand, $options: 'i' };
        if (vehicleType) filters.vehicleType = { $regex: vehicleType, $options: 'i' };

        const vehicles = await Vehicle.find(filters);
        res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
        console.error('Error searching vehicles:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
