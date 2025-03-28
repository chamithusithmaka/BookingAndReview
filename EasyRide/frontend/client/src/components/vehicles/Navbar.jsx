import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NotificationIcon from "../Bookings/Ntification"; // Import the NotificationIcon component


const Navigation = () => {
    return (
        <Navbar expand="lg" className="bg-light shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">EasyRide</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/vehicles">Vehicles</Nav.Link>
                        <Nav.Link as={Link} to="/bookings">My Bookings</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                        <Nav.Link as={Link} to="/aboutUs">About Us</Nav.Link>
                        <li className="nav-item" styles={{marginTop: "100px"}}>
                {/* Notification Icon */}
                <NotificationIcon />
              </li>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;
