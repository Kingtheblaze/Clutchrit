// src/components/ui/NeonBadge.jsx
import React from 'react';

const NeonBadge = ({ children, color = 'cyan', className = '' }) => {
  const colorClasses = {
    cyan: 'border-cyan-glow text-cyan-glow shadow-[0_0_8px_rgba(0,240,255,0.3)]',
    red: 'border-neonRed text-neonRed shadow-[0_0_8px_rgba(255,45,85,0.3)]',
    violet: 'border-accentViolet text-accentViolet shadow-[0_0_8px_rgba(123,47,255,0.3)]',
  };

  return (
    <span className={`px-3 py-1 border text-xs font-display font-medium uppercase tracking-tighter rounded-full ${colorClasses[color] || colorClasses.cyan} ${className}`}>
      {children}
    </span>
  );
};

export default NeonBadge;
