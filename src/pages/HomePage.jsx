import React from 'react';
import Layout from '../components/layouts/Layout';
import HeroSection from '../components/sections/HeroSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import FeedbackSection from '../components/sections/FeedbackSection';

const HomePage = () => {
  return (
    <Layout>
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <FeedbackSection />
      {/* Add more sections here as needed */}
    </Layout>
  );
};

export default HomePage;