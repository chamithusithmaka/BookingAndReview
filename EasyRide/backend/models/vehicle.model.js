import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicleName: { type: String, required: true },
    brand: { type: String, required: true },
    vehicleType: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    fuelType: { type: String, required: true },
    mileage: { type: Number, required: true },
    seating: { type: Number, required: true },
    noOfDoors: { type: Number, required: true },
    transmission: { type: String, required: true },
    ac: { type: Boolean, required: true },
    licensePlate: { type: String, required: true, unique: true }, 
    pricePerDay: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ["booked", "Available"], default: "Available" },
}, { timestamps: true });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
