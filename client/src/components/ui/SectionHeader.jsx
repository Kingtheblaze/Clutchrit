// src/components/ui/SectionHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle, align = 'left', className = '' }) => {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  return (
    <div className={`flex flex-col mb-12 ${alignmentClasses[align]} ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: '60px' }}
        transition={{ duration: 0.8 }}
        className="h-1 bg-cyan-glow mb-4"
      />
      <h2 className="text-3xl md:text-5xl font-display font-black mb-4 tracking-tighter">
        {title}
      </h2>
      {subtitle && (
        <p className="text-textMuted text-lg max-w-2xl font-body">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
