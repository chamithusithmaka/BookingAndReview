import React from 'react';
import { Container, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

const Hero = () => {
    const navigate = useNavigate(); // Initialize navigate
    
    // Function to handle button click
    const handleBookNowClick = () => {
        navigate('/vehicles'); // Navigate to /vehicles route
    };
    
    return (
        <div className="text-center p-5 bg-info text-white">
            <h1>Drive Your Freedom, Rent with Ease!</h1>
            <p>Find the perfect car for your journey</p>
            
        </div>
    );
};

export default Hero;