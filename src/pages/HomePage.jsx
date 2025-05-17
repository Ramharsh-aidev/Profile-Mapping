import React from 'react';
import Header from '../components/layouts/Header';
import HeroSection from '../components/sections/HeroSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import FeedbackSection from '../components/sections/FeedbackSection';
import Footer from '../components/layouts/Footer';

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <FeedbackSection />
      <Footer />
    </>
  );
};

export default HomePage;