// src/components/dashboard/ComingSoonSection.jsx
import React from 'react';

const ComingSoonSection = ({ title }) => (
  <div className="p-8 md:p-12 text-center">
    <h2 className="text-2xl font-semibold mb-6 text-slate-700">{title}</h2>
    <p className="text-slate-500">This feature is coming soon. Stay tuned for updates!</p>
    <div className="mt-8 text-5xl text-slate-300">✨</div>
  </div>
);

export default ComingSoonSection;