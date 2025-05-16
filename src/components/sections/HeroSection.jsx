// src/components/sections/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { Fade } from "react-awesome-reveal";
import homePageData from '../../data/homePageData.json'; // Import the data

const HeroSection = () => {
  const { title, subtitle, primaryButtonText, primaryButtonLink, secondaryButtonText, backgroundImage } = homePageData.heroSection;

  const handleLearnMoreScroll = () => {
    // The anchor #how-it-works-section is handled by browser's native smooth scroll
    // or a global CSS rule 'scroll-behavior: smooth;'
    const section = document.getElementById('how-it-works-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-100 to-gray-50 py-20 md:py-32 text-center overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <Fade direction="down" triggerOnce>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            {title}
          </h1>
        </Fade>
        <Fade direction="up" delay={200} triggerOnce>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </Fade>
        <Fade direction="up" delay={400} triggerOnce>
          <div className="flex justify-center space-x-4">
            <Link to={primaryButtonLink}>
              <Button variant="primary">{primaryButtonText}</Button>
            </Link>
            <Button variant="secondary" onClick={handleLearnMoreScroll}>
              {secondaryButtonText}
            </Button>
          </div>
        </Fade>
      </div>
    </section>
  );
};

export default HeroSection;