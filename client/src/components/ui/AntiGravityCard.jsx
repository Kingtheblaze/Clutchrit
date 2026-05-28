// src/components/ui/AntiGravityCard.jsx
import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * AntiGravityCard
 * ──────────────────────────────────────────────────────────────────────────
 * A composable wrapper that gives any content:
 *  • Continuous idle float animation (out-of-phase via `floatVariant` prop)
 *  • Mouse-proximity 3D parallax tilt (preserve-3d)
 *  • Neon glow shadow that breathes with the float cycle
 *
 * Props:
 *  @param {ReactNode}  children
 *  @param {string}     className     – additional Tailwind classes
 *  @param {'cyan'|'magenta'|'acid'} glowColor – which accent to use
 *  @param {'a'|'b'|'c'} floatVariant – selects a distinct float phase
 *  @param {number}     delay         – Framer Motion animation delay (s)
 *  @param {boolean}    disableTilt   – skip mouse tilt (for small chips)
 */
const FLOAT_KEYFRAMES = {
  a: { y: [0, -8,  0, -4,  0], rotateX: [0,  1,   0, -0.5, 0], rotateY: [0, -0.8, 0,  0.5, 0] },
  b: { y: [0, -5,  0, -10, 0], rotateX: [0, -1,   0,  1,   0], rotateY: [0,  1,   0, -0.8, 0] },
  c: { y: [0, -12, 0, -3,  0], rotateX: [0,  0.5, 0,  1.5, 0], rotateY: [0,  0.8, 0, -1,   0] },
};

const GLOW_SHADOW = {
  cyan:    'var(--ag-cyan-glow)',
  magenta: 'var(--ag-magenta-glow)',
  acid:    'var(--acid-glow)',
};

const AntiGravityCard = ({
  children,
  className = '',
  glowColor = 'cyan',
  floatVariant = 'a',
  delay = 0,
  disableTilt = false,
}) => {
  const ref = useRef(null);

  // Mouse position for tilt (normalized -0.5 → 0.5)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springCfg = { stiffness: 250, damping: 28, mass: 0.6 };
  const mxSpring = useSpring(mx, springCfg);
  const mySpring = useSpring(my, springCfg);

  const rotateX = useTransform(mySpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mxSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = useCallback((e) => {
    if (disableTilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [disableTilt, mx, my]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  const floatKf = FLOAT_KEYFRAMES[floatVariant] || FLOAT_KEYFRAMES.a;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Idle float — runs forever, offset by delay for stagger
      animate={floatKf}
      transition={{
        duration: 5.5 + (floatVariant === 'b' ? 1 : floatVariant === 'c' ? 2 : 0),
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      style={{
        rotateX: disableTilt ? 0 : rotateX,
        rotateY: disableTilt ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
        // Glow shadow breathes slightly via the motion — we set it statically
        // and let the translate/rotate give the illusion of depth
        filter: `drop-shadow(0 12px 24px ${glowColor === 'cyan' ? 'rgba(0,240,255,0.18)' : glowColor === 'magenta' ? 'rgba(255,0,127,0.18)' : 'rgba(200,255,0,0.18)'})`,
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AntiGravityCard;
