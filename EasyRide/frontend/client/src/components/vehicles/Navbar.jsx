import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NotificationIcon from "../Bookings/Ntification"; // Import the NotificationIcon component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
    return (
        <Navbar expand="lg" className="bg-white shadow-sm py-3 sticky-top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <div className="d-flex justify-content-center align-items-center bg-primary rounded-circle me-2" style={{ width: "38px", height: "38px" }}>
                        <FontAwesomeIcon icon={faCar} className="text-white" />
                    </div>
                    <span className="fw-bold fs-4">Easy<span className="text-primary">Ride</span></span>
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link 
                            as={Link} 
                            to="/" 
                            className="mx-1 px-3 py-2 rounded-pill fw-medium text-dark"
                            activeClassName="active bg-primary-subtle"
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/vehicles" 
                            className="mx-1 px-3 py-2 rounded-pill fw-medium text-dark"
                            activeClassName="active bg-primary-subtle"
                        >
                            Vehicles
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/bookings" 
                            className="mx-1 px-3 py-2 rounded-pill fw-medium text-dark"
                            activeClassName="active bg-primary-subtle"
                        >
                            My Bookings
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/contact" 
                            className="mx-1 px-3 py-2 rounded-pill fw-medium text-dark"
                            activeClassName="active bg-primary-subtle"
                        >
                            Contact
                        </Nav.Link>
                        <Nav.Link 
                            as={Link} 
                            to="/aboutUs" 
                            className="mx-1 px-3 py-2 rounded-pill fw-medium text-dark"
                            activeClassName="active bg-primary-subtle"
                        >
                            About Us
                        </Nav.Link>
                        
                        <div className="nav-item d-flex align-items-center ms-2 position-relative">
                            <NotificationIcon />
                        </div>
                        
                       
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;