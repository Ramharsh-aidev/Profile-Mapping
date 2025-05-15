import React from 'react';
import Card from '../ui/Card';
// You might use react-icons or simple div placeholders for icons
// npm install react-icons
import { FaListAlt, FaUser, FaMapMarkedAlt } from 'react-icons/fa';

const howItWorksSteps = [
  {
    icon: <FaListAlt size={30} className="text-blue-600 mb-4" />,
    title: "Browse Profiles",
    description: "Easily navigate through a list of available profiles.",
  },
  {
    icon: <FaUser size={30} className="text-blue-600 mb-4" />,
    title: "View Details",
    description: "Click on a profile to see detailed information.",
  },
  {
    icon: <FaMapMarkedAlt size={30} className="text-blue-600 mb-4" />,
    title: "Explore on Map",
    description: "See the profile's address visualized interactively on a map.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          How Profile Explorer Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {howItWorksSteps.map((step, index) => (
            <Card key={index} className="text-center">
              <div className="flex justify-center items-center mb-4">
                {step.icon}
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h4>
              <p className="text-gray-600">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;