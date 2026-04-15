// src/components/ui/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-cyan-glow/20 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-cyan-glow rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 font-display text-sm tracking-widest text-cyan-glow uppercase animate-pulse">
        Initializing...
      </p>
    </div>
  );
};

export default LoadingSpinner;
