import mongoose from "mongoose";
import Users from "../models/users.model.js"; // Adjust the path based on your project structure

// Connect to MongoDB
mongoose.connect("mongodb+srv://rashmikaj315:uO50nc6J8VQdeeJ4@cluster0.v84ml.mongodb.net/users?retryWrites=true&w=majority&appName=Cluster0", {
}).then(async () => {
    console.log("Connected to MongoDB");

    // Update all users who do not have a role field
    const result = await Users.updateMany({ role: { $exists: false } }, { $set: { role: "user" } });

    console.log(`${result.modifiedCount} users updated with default role.`);
    mongoose.connection.close();
}).catch(err => console.error(err));
