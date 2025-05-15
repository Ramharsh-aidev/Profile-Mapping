// src/components/sections/AboutSection.jsx
import React from 'react';

const AboutSection = () => {
  return (
    // Use new background and text colors
    <section className="py-12 bg-background-light rounded-lg mb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-text-primary">About ProfileMapper</h2>
        <p className="text-lg text-text-secondary max-w-3xl mx-auto">
          ProfileMapper is a web application designed to help you connect with individuals by visualizing their geographic locations. Browse through a list of user profiles and explore their addresses directly on an interactive map powered by OpenStreetMap. Our goal is to provide a simple yet powerful way to understand the spatial distribution of our community.
        </p>
        {/* Add more details or features here */}
      </div>
    </section>
  );
};

export default AboutSection;