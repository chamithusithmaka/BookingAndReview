import express from 'express';
import jwt from 'jsonwebtoken';
import Users from '../models/users.model.js';  // Correct import for your user model

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token if credentials are valid
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,  // Your secret key for signing the JWT
            { expiresIn: '1h' }  // Token expires in 1 hour
        );

        // Send the token and user details in the response
        res.status(200).json({
            success: true,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
