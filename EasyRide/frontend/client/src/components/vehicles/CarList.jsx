import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

// Import images from the assets folder
import bmwImage from '../../assets/bmw.jpg';
import audiImage from '../../assets/audi.jpg';
import mercedesImage from '../../assets/mercedes.jpg';


const cars = [
    { name: "BMW", img: bmwImage, price: "LKR 15,000/DAY" },
    { name: "Audi", img: audiImage, price: "LKR 17,000/DAY" },
    { name: "Mercedes", img: mercedesImage, price: "LKR 20,000/DAY" },
];

const CarList = () => {
    return (
        <Container className="my-4">
            <h3 className="text-center">Popular Makes</h3>
            <Row>
                {cars.map((car, index) => (
                    <Col md={4} key={index} className="mb-3">
                        <Card className="shadow-sm">
                            <Card.Img variant="top" src={car.img} />
                            <Card.Body>
                                <Card.Title>{car.name}</Card.Title>
                                <Card.Text>{car.price}</Card.Text>
                                
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CarList;
