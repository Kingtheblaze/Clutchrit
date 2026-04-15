// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Bell, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: 'Events', path: '/admin/events', icon: <Calendar size={18} /> },
    { name: 'Announcements', path: '/admin/announcements', icon: <Bell size={18} /> },
    { name: 'Members', path: '/admin/members', icon: <Users size={18} /> },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-cyan-muted/20 min-h-screen pt-8 flex flex-col">
      <div className="px-6 mb-10">
        <h2 className="text-xs font-mono text-cyan-glow uppercase tracking-[0.3em] font-bold">Admin Panel</h2>
        <div className="h-1 w-8 bg-cyan-glow mt-2" />
      </div>

      <nav className="flex-grow px-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-3 font-display text-sm uppercase tracking-wider transition-all rounded-sm ${
              location.pathname === link.path
                ? 'bg-cyan-glow/10 text-cyan-glow border-l-4 border-cyan-glow'
                : 'text-textMuted hover:bg-surface/50 hover:text-textPrimary border-l-4 border-transparent'
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-cyan-muted/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-neonRed font-display text-sm uppercase tracking-wider hover:bg-neonRed/10 transition-all rounded-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
