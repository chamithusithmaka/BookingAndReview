import React from "react";
import Hero from "../../components/vehicles/Hero";

import CarCarousel from "../../components/vehicles/CarCarousel";
import CarList from "../../components/vehicles/CarList";
import Navigation from "../../components/vehicles/Navbar"


const Home = () => {
  return (
    <>
    <Navigation />
  
      <Hero />
     <CarList/>
      <CarCarousel />
     
    </>
  );
};

export default Home;
