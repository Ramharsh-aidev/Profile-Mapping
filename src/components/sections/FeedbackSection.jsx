// src/components/sections/FeedbackSection.jsx
import React from 'react';
import Card from '../ui/Card';
import PlaceholderImage from '../../assets/profile-placeholder.png'; // Keep this import
import { Fade, Slide } from "react-awesome-reveal";
import homePageData from '../../data/homePageData.json'; // Import the data

const FeedbackSection = () => {
  const { title, testimonials } = homePageData.feedbackSection;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <Fade direction="down" triggerOnce>
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            {title}
          </h2>
        </Fade>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Slide direction="up" key={index} delay={index * 100} triggerOnce>
              <Card className="flex flex-col items-center text-center h-full">
                <img
                  src={testimonial.image === "placeholder" ? PlaceholderImage : testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-blue-600"
                />
                <h5 className="text-lg font-semibold text-gray-800">{testimonial.name}</h5>
                <p className="text-sm text-gray-500 mb-4">{testimonial.title}</p>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </Card>
            </Slide>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;