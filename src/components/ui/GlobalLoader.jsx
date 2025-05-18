// src/components/ui/GlobalLoader.jsx
import React from 'react';
import PropTypes from 'prop-types';

const GlobalLoader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-sky-100/30 backdrop-blur-sm flex items-center justify-center z-[9999] transition-opacity duration-300 ease-in-out">
      <div className="p-6 bg-white rounded-xl shadow-2xl flex flex-col items-center space-y-3">
        {/* Example: A more modern spinner */}
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-600 font-medium">Loading...</p>
      </div>
      {/* Alternative: Progress Bar Style (requires more CSS)
        <div className="fixed top-0 left-0 w-full h-1">
          <div className="h-full bg-sky-500 animate-pulse" style={{ width: '70%' }}></div> // Animate width for progress
        </div>
      */}
    </div>
  );
};

GlobalLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};

export default GlobalLoader;