import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-100 to-gray-50 py-20 md:py-32 text-center overflow-hidden">
      {/* Background elements (optional, like the image in the example) */}
      <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: 'url(/path-to-your-background-image.jpg)' }}></div> {/* Add a suitable image or keep it just gradient */}

      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Explore Profiles and Locations Visually
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Navigate through a list of profiles and interactively explore their addresses on a map for intuitive geographic visualization.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/profiles">
            <Button variant="primary">View Profiles</Button>
          </Link>
          <Link to="#learn-more"> {/* Link to a section on the page */}
             <Button variant="secondary">Learn More</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;