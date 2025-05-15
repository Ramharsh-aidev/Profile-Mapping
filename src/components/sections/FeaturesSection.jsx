import React from 'react';
import Card from '../ui/Card';
// Use react-icons or simple div placeholders for icons
import { FaMapPin, FaList, FaSearch, FaMobileAlt, FaLock } from 'react-icons/fa';

const features = [
  {
    icon: <FaMapPin size={24} className="text-blue-600 mr-4" />,
    title: "Interactive Map Display",
    description: "Visualize profile addresses directly on a dynamic map.",
  },
  {
    icon: <FaList size={24} className="text-blue-600 mr-4" />,
    title: "Profile List Navigation",
    description: "Easily browse and select profiles from a clear list view.",
  },
  {
    icon: <FaSearch size={24} className="text-blue-600 mr-4" />,
    title: "Search & Filtering",
    description: "Quickly find profiles using search and filtering options.", // Assuming this will be a feature
  },
  {
    icon: <FaMobileAlt size={24} className="text-blue-600 mr-4" />,
    title: "Responsive Design",
    description: "Access and explore profiles seamlessly on any device.",
  },
  {
    icon: <FaLock size={24} className="text-blue-600 mr-4" />,
    title: "Data Security",
    description: "Your profile data is handled with privacy and security in mind.", // Adapt as necessary
  },
  // Add more features relevant to profile/map exploration
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <div className="flex items-start mb-3">
                {feature.icon}
                <h4 className="text-xl font-semibold text-gray-800">{feature.title}</h4>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;