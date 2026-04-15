// src/components/ui/GlowCard.jsx
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const GlowCard = ({ children, className = '', hoverGlow = true }) => {
  const ref = useRef(null);

  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs to make the tilt feel natural
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  // Transform coordinates into degrees of rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current || !hoverGlow) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate normalized position -0.5 to 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: hoverGlow ? rotateX : 0,
        rotateY: hoverGlow ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      whileHover={hoverGlow ? { scale: 1.02, zIndex: 10 } : {}}
      className={`glass-panel p-6 relative overflow-visible group transition-all duration-300 ${className}`}
    >
      {/* 3D Depth wrapper inside the card to pop out */}
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="h-full w-full">
        {/* Animated Neon Edges */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-glow to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_10px_#00f0ff]" style={{ transform: "translateZ(-10px)" }} />
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neonRed to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_10px_#ff2d55]" style={{ transform: "translateZ(-10px)" }} />
        
        {/* Deep 3D Shadow underneath the card */}
        <div className="absolute inset-0 bg-cyan-glow/0 group-hover:bg-cyan-glow/5 group-hover:shadow-[0_20px_50px_rgba(0,240,255,0.15)] transition-all duration-500 rounded-lg -z-10" style={{ transform: "translateZ(-50px)" }} />
        
        {children}
      </div>
    </motion.div>
  );
};

export default GlowCard;
