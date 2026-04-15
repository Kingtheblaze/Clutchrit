// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaDiscord, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-void border-t border-border pt-24 pb-12 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 pointer-events-none opacity-[0.03] translate-x-1/4 translate-y-[-10%] select-none">
        <span className="font-heading text-[30vw] text-acid leading-none">RIT</span>
      </div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-16 relative z-10">
        {/* Column 1: Info */}
        <div className="lg:col-span-2 flex flex-col space-y-8">
          <Link to="/" className="flex flex-col group">
            <div className="flex items-baseline mb-2">
              <span className="font-heading text-6xl text-text-0 tracking-tighter">CLUTCH</span>
              <span className="font-heading text-6xl text-acid" style={{ textShadow: 'var(--acid-glow)' }}>RIT</span>
            </div>
            <div className="h-[2px] w-24 bg-acid opacity-30 group-hover:w-full transition-all duration-700" />
          </Link>
          <p className="text-text-1 max-w-md leading-relaxed font-body text-lg italic">
            The official gaming elite of Ramaiah Institute of Technology. 
            We don't just participate; we dominate. Leveling up the campus gaming culture since 2019.
          </p>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-acid uppercase tracking-[0.3em]">LOCATION :: MSRIT MAIN CAMPUS</span>
            <span className="text-xs font-mono text-text-2 uppercase tracking-widest">BANGALORE, IN // SECTOR 560054</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col space-y-8">
          <h4 className="font-subheading text-xl uppercase tracking-[0.2em] text-text-0 border-l-4 border-acid pl-4">NAVIGATION</h4>
          <div className="flex flex-col space-y-3 font-subheading text-sm uppercase tracking-widest">
            <Link to="/" className="text-text-1 hover:text-acid transition-colors">{'>>'} Home</Link>
            <Link to="/#about-section" className="text-text-1 hover:text-acid transition-colors">{'>>'} Genesis</Link>
            <Link to="/members" className="text-text-1 hover:text-acid transition-colors">{'>>'} Operatives</Link>
            <Link to="/events" className="text-text-1 hover:text-acid transition-colors">{'>>'} Missions</Link>
            <Link to="/announcements" className="text-text-1 hover:text-acid transition-colors">{'>>'} Drops</Link>
            <Link to="/login" className="text-text-2 hover:text-fire transition-colors pt-4">{'>>'} ROOT_LOGIN</Link>
          </div>
        </div>

        {/* Column 3: Socials */}
        <div className="flex flex-col space-y-8">
          <h4 className="font-subheading text-xl uppercase tracking-[0.2em] text-text-0 border-l-4 border-fire pl-4">COMM_CHANNELS</h4>
          <div className="flex gap-4">
            <a href="https://instagram.com/clutchrit" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-surface-1 border border-border flex items-center justify-center text-text-1 hover:bg-fire hover:text-void hover:border-fire transition-all duration-300">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="w-12 h-12 bg-surface-1 border border-border flex items-center justify-center text-text-1 hover:bg-acid hover:text-void hover:border-acid transition-all duration-300">
              <FaDiscord size={20} />
            </a>
            <a href="#" className="w-12 h-12 bg-surface-1 border border-border flex items-center justify-center text-text-1 hover:bg-ice hover:text-void hover:border-ice transition-all duration-300">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="w-12 h-12 bg-surface-1 border border-border flex items-center justify-center text-text-1 hover:bg-fire hover:text-void hover:border-fire transition-all duration-300">
              <FaYoutube size={20} />
            </a>
          </div>
          <div className="p-4 border-l-2 border-acid bg-acid-dim/10">
            <p className="text-[10px] font-mono text-acid uppercase tracking-tighter leading-tight">
              ENCRYPTED COMMUNICATION ACTIVE. JOIN THE DISCORD FOR SCRIM SCHEDULES AND RECRUITMENT UPDATES.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-24 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-text-2 uppercase tracking-[0.3em]">
        <div>© {new Date().getFullYear()} CLUTCHRIT // ALL RIGHTS RESERVED</div>
        <div className="mt-4 md:mt-0 opacity-50 flex items-center gap-2">
           <div className="w-2 h-2 bg-acid animate-pulse" />
           SYSTEMS_ONLINE :: v3.0.0
        </div>
      </div>
    </footer>
  );
};

export default Footer;
