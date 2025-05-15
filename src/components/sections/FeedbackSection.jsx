import React from 'react';
import Card from '../ui/Card';
// Use placeholder images or actual profile images
import PlaceholderImage from '../../assets/profile-placeholder.png'; // Create a placeholder image

const testimonials = [
  {
    image: PlaceholderImage,
    name: "Alex Johnson",
    title: "Urban Planner", // Example role
    quote: "Profile Explorer is incredibly useful for visualizing addresses. The map integration is smooth and intuitive. A fantastic tool!",
  },
  {
    image: PlaceholderImage,
    name: "Maria Garcia",
    title: "Researcher",
    quote: "Finding specific locations linked to profiles has never been easier. The interface is clean, and it just works.",
  },
  {
    image: PlaceholderImage,
    name: "David Lee",
    title: "Data Analyst",
    quote: "The ability to quickly see addresses on a map saves me so much time. Highly recommend for anyone working with geographic data!",
  },
];

const FeedbackSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col items-center text-center">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-blue-600"
              />
              <h5 className="text-lg font-semibold text-gray-800">{testimonial.name}</h5>
              <p className="text-sm text-gray-500 mb-4">{testimonial.title}</p>
              <p className="text-gray-600 italic">"{testimonial.quote}"</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;