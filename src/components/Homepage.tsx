import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/ServicesSection';
import Benefits from '../components/Benefits';
import GoldGrowthNetwork from '../components/GoldGrowthNetwork';
import Footer from '../components/Footer';

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Benefits />
      <GoldGrowthNetwork />
      <Footer />
    </div>
  );
};

export default Homepage;