// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShake, setIsShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('ACCESS DENIED. INVALID CREDENTIALS.');
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-void flex border-t border-border">
      {/* ━━━ LEFT PANEL (Decoration) ━━━━━━━━━━━━━━━━━━━ */}
      <div className="hidden lg:flex w-[60%] relative overflow-hidden bg-void items-center justify-center">
        {/* Giant Rotated Text */}
        <div 
          className="absolute font-heading text-[15vw] text-text-0 opacity-[0.04] select-none pointer-events-none"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', right: '10%' }}
        >
          CLUTCHRIT
        </div>

        {/* Abstract Geometry SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <circle cx="200" cy="800" r="400" stroke="var(--acid)" strokeWidth="1" fill="none" strokeDasharray="10 20" />
          <rect x="100" y="200" width="300" height="600" stroke="var(--acid)" strokeWidth="2" fill="none" />
          <path d="M0,1000 L1000,0" stroke="var(--acid)" strokeWidth="1" strokeOpacity="0.5" />
          <path d="M100,1000 L1100,0" stroke="var(--acid)" strokeWidth="1" strokeOpacity="0.2" />
        </svg>

        {/* Floating Text Fragments */}
        <div className="absolute top-[20%] left-[20%] font-mono text-[10px] text-acid opacity-20">SYSTEM // INITIALIZED</div>
        <div className="absolute bottom-[30%] right-[30%] font-mono text-[10px] text-acid opacity-40">CONNECTION :: SECURE</div>
        <div className="absolute top-[60%] left-[40%] font-mono text-[10px] text-acid opacity-20">VERSION : v2.0</div>
        <div className="absolute top-[10%] right-[10%] font-mono text-xs text-acid opacity-30">ROOT ACCESS REQUIRED</div>
      </div>

      {/* ━━━ RIGHT PANEL (Form) ━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center bg-surface-1 h-screen p-8 md:p-16 border-l border-border relative z-10">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-acid animate-pulse" />
              <p className="font-subheading text-acid uppercase text-xs tracking-[0.2em]">ADMIN ACCESS TERMINAL</p>
            </div>
            <h1 className="font-heading text-6xl md:text-7xl leading-none text-text-0 mb-[-10px]">CLUTCH</h1>
            <h1 className="font-heading text-6xl md:text-7xl leading-none text-acid" style={{ textShadow: 'var(--acid-glow)' }}>RIT</h1>
            <div className="w-full h-[1px] bg-acid opacity-30 mt-8" />
          </div>

          <motion.form 
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
            animate={isShake ? { x: [0, 10, -10, 10, -10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col gap-2">
              <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-surface-2 border border-border text-text-0 p-[12px_16px] font-mono text-sm focus:border-acid focus:outline-none transition-colors"
                placeholder="root_admin"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-surface-2 border border-border text-text-0 p-[12px_16px] font-mono text-sm focus:border-acid focus:outline-none transition-colors"
                placeholder="••••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-fire font-mono text-xs mt-[-10px]">
                {`> ${error}`}
              </div>
            )}

            <button
              type="submit"
              className="mt-4 w-full bg-acid text-void font-subheading font-bold uppercase tracking-widest py-4 hover:shadow-acid-glow transition-all duration-300 transform active:scale-95"
            >
              AUTHENTICATE →
            </button>
          </motion.form>
          
          <div className="mt-16 pt-8 border-t border-border border-dashed text-text-2 font-mono text-[10px] uppercase relative flex flex-col gap-4">
            <Link to="/register" className="text-acid hover:text-text-0 transition-colors">
              [ RECRUIT NEW ADMIN ]
            </Link>
            <p className="opacity-50">UNAUTHORIZED ACCESS IS PROHIBITED. ALL ATTEMPTS ARE LOGGED.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
