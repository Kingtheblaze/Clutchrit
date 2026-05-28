// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, ChevronRight, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const scrollToAbout = (e) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/#about-section');
      // The actual scroll will be handled by the useEffect or after navigation
      setTimeout(() => {
        const element = document.getElementById('about-section');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById('about-section');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '#about-section', isAnchor: true },
    { name: 'Members', path: '/members' },
    { name: 'Events', path: '/events' },
    { name: 'Announcements', path: '/announcements' },
  ];

  return (
    <nav
      className={`fixed top-8 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-void/80 backdrop-blur-lg border-b border-border py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center group gap-3">
          <motion.img 
            src="/logo.jpeg" 
            alt="ClutchRIT Logo" 
            className="h-10 w-auto border border-acid/20 shadow-acid-glow group-hover:scale-110 transition-transform duration-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          />
          <div className="flex items-baseline hidden sm:flex">
            <span className="font-heading text-4xl text-text-0 tracking-tighter transition-all group-hover:tracking-normal">
              CLUTCH
            </span>
            <span className="font-heading text-4xl text-acid" style={{ textShadow: 'var(--acid-glow)' }}>
              RIT
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            link.isAnchor ? (
              <a
                key={link.name}
                href={link.path}
                onClick={scrollToAbout}
                className={`font-subheading text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:text-acid relative group ${
                  location.hash === '#about-section' ? 'text-acid' : 'text-text-1'
                }`}
              >
                {link.name}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-[1px] bg-acid transition-all duration-300 group-hover:w-full"
                  animate={{ width: location.hash === '#about-section' ? '100%' : '0%' }}
                />
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.path}
                className={`font-subheading text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:text-acid relative group ${
                  location.pathname === link.path ? 'text-acid' : 'text-text-1'
                }`}
              >
                {link.name}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-[1px] bg-acid transition-all duration-300 group-hover:w-full"
                  animate={{ width: location.pathname === link.path ? '100%' : '0%' }}
                />
              </Link>
            )
          ))}
          
          <div className="h-6 w-[1px] bg-border mx-2" />

          {isAuthenticated ? (
            <div className="flex items-center space-x-4 pl-4 border-l border-border/30">
              <Link
                to="/admin"
                className="text-text-1 hover:text-acid transition-colors"
                title="Admin Dashboard"
              >
                <LayoutDashboard size={18} />
              </Link>
              <button
                onClick={logout}
                className="text-text-1 hover:text-fire transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to={location.pathname === '/login' ? '/' : '/login'} className="font-subheading text-[10px] text-text-2 hover:text-acid uppercase tracking-widest transition-colors border border-border px-3 py-1">
              TERMINAL_LOG
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-acid p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="lg:hidden fixed inset-y-0 right-0 w-[80%] bg-surface-1 border-l border-border z-50 p-8 flex flex-col pt-24"
          >
            <div className="flex flex-col space-y-8">
              {navLinks.map((link) => (
                link.isAnchor ? (
                  <a
                    key={link.name}
                    href={link.path}
                    onClick={scrollToAbout}
                    className={`flex items-center justify-between font-heading text-4xl uppercase tracking-widest ${
                      location.hash === '#about-section' ? 'text-acid' : 'text-text-0'
                    }`}
                  >
                    {link.name}
                    <ChevronRight size={24} className="text-acid" />
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center justify-between font-heading text-4xl uppercase tracking-widest ${
                      location.pathname === link.path ? 'text-acid' : 'text-text-0'
                    }`}
                  >
                    {link.name}
                    <ChevronRight size={24} className="text-acid" />
                  </Link>
                )
              ))}
              
              <div className="pt-8 border-t border-border mt-auto flex flex-col space-y-6">
                {isAuthenticated ? (
                  <>
                    <Link to="/admin" className="flex items-center space-x-3 text-text-0 font-subheading uppercase tracking-widest">
                      <LayoutDashboard size={20} className="text-acid" />
                      <span>Admin Control</span>
                    </Link>
                    <button onClick={logout} className="flex items-center space-x-3 text-fire font-subheading uppercase tracking-widest text-left">
                      <LogOut size={20} />
                      <span>Disconnect</span>
                    </button>
                  </>
                ) : (
                  <Link to={location.pathname === '/login' ? '/' : '/login'} className="font-subheading text-xs text-text-2 uppercase tracking-widest border border-border p-4 text-center">
                    ADMIN GATEWAY
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
