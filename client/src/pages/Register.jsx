// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [isShake, setIsShake] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('PASSWORDS DO NOT MATCH.');
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return;
    }
    
    if (password.length < 6) {
      setError('PASSWORD MUST BE AT LEAST 6 CHARACTERS.');
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      return;
    }

    const res = await register(username, password, role);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(`REGISTRATION FAILED: ${res.message.toUpperCase()}`);
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
          INITIATE
        </div>

        {/* Abstract Geometry SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <circle cx="800" cy="200" r="300" stroke="var(--fire)" strokeWidth="1" fill="none" strokeDasharray="5 15" />
          <rect x="600" y="200" width="200" height="400" stroke="var(--fire)" strokeWidth="2" fill="none" />
          <path d="M1000,1000 L0,0" stroke="var(--fire)" strokeWidth="1" strokeOpacity="0.5" />
        </svg>

        {/* Floating Text Fragments */}
        <div className="absolute top-[20%] right-[20%] font-mono text-[10px] text-fire opacity-20">SYSTEM // RECRUITMENT</div>
        <div className="absolute bottom-[30%] left-[30%] font-mono text-[10px] text-fire opacity-40">CONNECTION :: PENDING</div>
        <div className="absolute top-[60%] right-[40%] font-mono text-[10px] text-fire opacity-20">ENCRYPTION : ACTIVE</div>
        <div className="absolute top-[10%] left-[10%] font-mono text-xs text-fire opacity-30">NEW NODE DETECTED</div>
      </div>

      {/* ━━━ RIGHT PANEL (Form) ━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center bg-surface-1 h-screen p-8 md:p-16 border-l border-border relative z-10 overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-fire animate-pulse" />
              <p className="font-subheading text-fire uppercase text-xs tracking-[0.2em]">ADMIN RECRUITMENT</p>
            </div>
            <h1 className="font-heading text-6xl md:text-7xl leading-none text-text-0 mb-[-10px]">NEW</h1>
            <h1 className="font-heading text-6xl md:text-7xl leading-none text-fire" style={{ textShadow: 'var(--fire-glow)' }}>ADMIN</h1>
            <div className="w-full h-[1px] bg-fire opacity-30 mt-8" />
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
                className="bg-surface-2 border border-border text-text-0 p-[12px_16px] font-mono text-sm focus:border-fire focus:outline-none transition-colors"
                placeholder="new_root_admin"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">ROLE</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-surface-2 border border-border text-text-0 p-[12px_16px] font-mono text-sm focus:border-fire focus:outline-none transition-colors cursor-pointer"
              >
                <option value="admin">CLUB ADMIN</option>
                <option value="super_admin">SUPER ADMIN</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-surface-2 border border-border text-text-0 p-[12px_16px] font-mono text-sm focus:border-fire focus:outline-none transition-colors"
                placeholder="••••••••••"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-subheading text-text-1 text-[10px] uppercase tracking-widest">CONFIRM PASSWORD</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-surface-2 border border-border text-text-0 p-[12px_16px] font-mono text-sm focus:border-fire focus:outline-none transition-colors"
                placeholder="••••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-fire font-mono text-xs">
                {`> ${error}`}
              </div>
            )}

            <button
              type="submit"
              className="mt-4 w-full bg-fire text-void font-subheading font-bold uppercase tracking-widest py-4 hover:shadow-fire-glow transition-all duration-300 transform active:scale-95"
            >
              INITIALIZE ADMIN →
            </button>

            <Link to="/login" className="text-text-2 hover:text-text-0 text-center font-mono text-[10px] uppercase mt-2 transition-colors">
              [ RETURN TO LOGIN ]
            </Link>
          </motion.form>
          
          <div className="mt-12 pt-8 border-t border-border border-dashed text-text-2 font-mono text-[10px] uppercase relative">
            <p className="opacity-50">REGISTRATION GRANTS ROOT PRIVILEGES TO DB AND CLOUDINARY LOGIC IN THE MERN/SERN APP.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
