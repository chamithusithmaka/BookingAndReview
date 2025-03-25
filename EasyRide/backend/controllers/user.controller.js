import User from '../models/users.model.js';
import bcrypt from 'bcryptjs';
import validator from 'validator'; // For email validation
import jwt from 'jsonwebtoken';

// Create a new user
export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
    }

    try {
        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with hashed password
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'user', // Default to 'user' role if not provided
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.log("Error in creating user", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find(); // Retrieve all users from the database

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({ success: true, data: users }); // Return all users data
    } catch (error) {
        console.log("Error in fetching users", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Get a user by ID
export const getUser = async (req, res) => {
    try {
        const { id } = req.params; // Extract the user ID from the URL parameters

        const user = await User.findById(id); // Find the user by ID

        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Handle case where user is not found
        }

        res.status(200).json({ success: true, data: user }); // Return the user data
    } catch (error) {
        console.log("Error in fetching user", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' }); // Handle any server errors
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter both email and password' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' }); // User not found
        }

        // Compare the password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' }); // Incorrect password
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET, // You should store your JWT secret in environment variables
            { expiresIn: '1h' } // Set the expiration time for the token (optional)
        );

        // Send the response with token and user info
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log("Error in logging in", error.message);
        res.status(500).json({ message: 'Internal Server Error' }); // Handle any server errors
    }
};
