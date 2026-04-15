// src/components/ui/CounterStat.jsx
import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const CounterStat = ({ value, label, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setCount(Math.floor(latest));
    });
  }, [springValue]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-4">
      <div className="text-4xl md:text-5xl font-display font-black text-cyan-glow mb-2 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
        {count}+
      </div>
      <div className="text-textMuted font-mono text-xs uppercase tracking-widest text-center">
        {label}
      </div>
    </div>
  );
};

export default CounterStat;
