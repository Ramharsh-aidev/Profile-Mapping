// src/components/sections/FeaturesSection.jsx
import React from 'react';
import Card from '../ui/Card';
// Import FaFilter
import { FaMapPin, FaList, FaSearch, FaMobileAlt, FaLock, FaFilter } from 'react-icons/fa';
import { Fade, Slide } from "react-awesome-reveal";
import homePageData from '../../data/homePageData.json';

// Map string identifiers to React components
const iconComponents = {
  FaMapPin: (props) => <FaMapPin {...props} />,
  FaList: (props) => <FaList {...props} />,
  FaSearch: (props) => <FaSearch {...props} />,
  FaFilter: (props) => <FaFilter {...props} />, // Add FaFilter to the map
  FaMobileAlt: (props) => <FaMobileAlt {...props} />,
  FaLock: (props) => <FaLock {...props} />,
};

const FeaturesSection = () => {
  const { title, features } = homePageData.featuresSection;

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <Fade direction="down" triggerOnce>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            {title}
          </h2>
        </Fade>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconComponents[feature.icon];
            return (
              <Fade direction="up" key={index} delay={index * 100} triggerOnce>
                <Card className="h-full">
                  <div className="flex items-start mb-3">
                    {IconComponent && <IconComponent size={24} className="text-blue-600 mr-4" />}
                    <h4 className="text-xl font-semibold text-gray-800">{feature.title}</h4>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </Fade>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;