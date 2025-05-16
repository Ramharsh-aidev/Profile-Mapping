// src/components/sections/HowItWorksSection.jsx
import React from 'react';
import Card from '../ui/Card';
import { FaListAlt, FaUser, FaMapMarkedAlt } from 'react-icons/fa'; // Import specific icons
import { Fade, Slide } from "react-awesome-reveal";
import homePageData from '../../data/homePageData.json'; // Import the data

// Map string identifiers to React components
const iconComponents = {
  FaListAlt: (props) => <FaListAlt {...props} />,
  FaUser: (props) => <FaUser {...props} />,
  FaMapMarkedAlt: (props) => <FaMapMarkedAlt {...props} />,
};

const HowItWorksSection = () => {
  const { title, steps } = homePageData.howItWorksSection;

  return (
    <section id="how-it-works-section" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <Fade direction="down" triggerOnce>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            {title}
          </h2>
        </Fade>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = iconComponents[step.icon];
            return (
              <Slide direction="up" key={index} delay={index * 100} triggerOnce>
                <Card className="text-center h-full">
                  <div className="flex justify-center items-center mb-4">
                    {IconComponent && <IconComponent size={30} className="text-blue-600 mb-4" />}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h4>
                  <p className="text-gray-600">{step.description}</p>
                </Card>
              </Slide>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;