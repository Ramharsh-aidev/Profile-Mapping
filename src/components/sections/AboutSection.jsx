// src/components/sections/AboutSection.jsx
import React from 'react';
import { Fade, Slide } from "react-awesome-reveal";
import homePageData from '../../data/homePageData.json'; // Import the data

const AboutSection = () => {
  const { title, description } = homePageData.aboutSection;

  return (
    <section className="py-12 bg-background-light rounded-lg mb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <Fade direction="down" triggerOnce>
          <h2 className="text-3xl font-bold mb-6 text-text-primary">{title}</h2>
        </Fade>
        <Slide direction="up" triggerOnce delay={200}>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {description}
          </p>
        </Slide>
      </div>
    </section>
  );
};

export default AboutSection;