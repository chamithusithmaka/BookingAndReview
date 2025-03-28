import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Container } from "react-bootstrap";

// Import images from the src/assets folder
import toyotaKdh from "../../assets/toyota_kdh.jpg";
import alto from "../../assets/alto.jpg";
import prius from "../../assets/pruis.jpg";


const CarCarousel = () => {
    return (
        <Container className="my-4">
            <h3 className="text-center">The Most Searched Vehicles</h3>
            <Carousel>
                <Carousel.Item>
                    <img 
                        className="d-block w-100" 
                        src={toyotaKdh} 
                        alt="Toyota KDH"
                    />
                    <Carousel.Caption>
                        <h5>Toyota KDH</h5>
                        <p>A reliable and spacious van, perfect for business and travel.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img 
                        className="d-block w-100" 
                        src={alto} 
                        alt="Alto Car"
                    />
                    <Carousel.Caption>
                        <h5>Alto</h5>
                        <p>An affordable and fuel-efficient compact car for city drives.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img 
                        className="d-block w-100" 
                        src={prius} 
                        alt="Prius Car"
                    />
                    <Carousel.Caption>
                        <h5>Prius</h5>
                        <p>A pioneer in hybrid technology, offering eco-friendly performance.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </Container>
    );
};

export default CarCarousel;
