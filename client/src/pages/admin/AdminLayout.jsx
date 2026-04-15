// src/pages/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Calendar, Megaphone, LogOut, Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', end: true, icon: LayoutDashboard },
    { name: 'Members', path: '/admin/members', end: false, icon: Users },
    { name: 'Events', path: '/admin/events', end: false, icon: Calendar },
    { name: 'Announcements', path: '/admin/announcements', end: false, icon: Megaphone },
  ];

  return (
    <div className="flex h-screen bg-void text-text-0 overflow-hidden font-body">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-surface-1 border-b border-border z-50 flex items-center justify-between px-4">
        <span className="font-heading text-acid text-2xl tracking-widest">CLUTCHRIT</span>
        <button className="text-acid" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] lg:h-screen w-full lg:w-60
        bg-surface-1 border-r border-border flex flex-col z-40 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="hidden lg:flex flex-col p-6 border-b border-border">
          <span className="font-heading text-3xl text-acid tracking-widest leading-none">CLUTCHRIT</span>
          <span className="font-subheading text-text-1 text-[10px] uppercase tracking-widest mt-1">CONTROL PANEL</span>
          {user?.username && (
            <div className="mt-4 pt-4 border-t border-border border-dashed font-mono text-text-2 text-xs">
              USER :: {user.username}
            </div>
          )}
        </div>

        {/* Desktop user display if mobile */}
        {user?.username && (
          <div className="lg:hidden p-4 border-b border-border font-mono text-text-2 text-[10px]">
             SYS_ADMIN :: {user.username}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 font-subheading text-sm uppercase tracking-widest transition-all
                ${isActive 
                  ? 'bg-surface-2 text-acid border-l-4 border-l-acid' 
                  : 'text-text-1 hover:bg-surface-2 hover:text-text-0 border-l-4 border-l-transparent'}
              `}
            >
              <link.icon size={18} className={({ isActive }) => isActive ? "text-acid" : "text-text-1"} />
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 border border-fire text-fire hover:bg-fire-dim 
                       font-subheading text-sm uppercase tracking-widest py-3 transition-colors"
          >
            <LogOut size={16} />
            SYSTEM LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-void relative pt-16 lg:pt-0">
        <div className="noise-overlay" />
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-glow/5 animate-scanline pointer-events-none" />
        <div className="p-6 md:p-8 lg:p-12 relative z-10 w-full min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
