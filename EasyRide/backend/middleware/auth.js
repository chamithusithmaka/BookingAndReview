import jwt from "jsonwebtoken";
import Users from "../models/users.model.js"; // Ensure correct path

// ✅ Middleware to check if user is authenticated
export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Users.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// ✅ Middleware to check if user is an admin
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};
