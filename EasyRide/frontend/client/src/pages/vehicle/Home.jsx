import React from "react";
import Hero from "../../components/vehicle/Hero";

import CarCarousel from "../../components/vehicle/CarCarousel";
import CarList from "../../components/vehicle/CarList";


const Home = () => {
  return (
    <>
  
      <Hero />
     <CarList/>
      <CarCarousel />
     
    </>
  );
};

export default Home;
