import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/ServicesSection';
import Benefits from '../components/Benefits';
import GoldGrowthNetwork from '../components/GoldGrowthNetwork';
import AdminLoginSection from '../components/AdminLoginSection';
import AdminQuickAccess from '../components/AdminQuickAccess';
import Footer from '../components/Footer';

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Benefits />
      <GoldGrowthNetwork />
      <AdminLoginSection />
      <Footer />
      
      {/* Admin Quick Access - Only visible in development */}
      {import.meta.env.DEV && <AdminQuickAccess />}
    </div>
  );
};

export default Homepage;