// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/admin/AdminSidebar';
import GlowCard from '../../components/ui/GlowCard';
import SectionHeader from '../../components/ui/SectionHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import api from '../../services/api';
import { Users, Calendar, Bell, Activity, ArrowUpRight, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    announcements: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [m, e, a] = await Promise.all([
          api.get('/members'),
          api.get('/events'),
          api.get('/announcements')
        ]);
        
        setStats({
          members: m.data.length,
          events: e.data.length,
          announcements: a.data.length,
          upcomingEvents: e.data.filter(ev => ev.status === 'upcoming').length
        });
      } catch (err) {
        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background text-textPrimary">
        <AdminSidebar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Personnel', value: stats.members, icon: <Users className="text-cyan-glow" />, color: 'cyan' },
    { label: 'Active Missions', value: stats.upcomingEvents, icon: <Calendar className="text-neonRed" />, color: 'red' },
    { label: 'Total Deployments', value: stats.events, icon: <Activity className="text-accentViolet" />, color: 'violet' },
    { label: 'Broadcasts', value: stats.announcements, icon: <Bell className="text-cyan-glow" />, color: 'cyan' },
  ];

  return (
    <div className="flex min-h-screen bg-background text-textPrimary">
      <AdminSidebar />
      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        <SectionHeader 
          title="Command Center" 
          subtitle="Real-time analytics and operational overview of the ClutchRIT network."
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <GlowCard className="group h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-sm bg-surface ring-1 ring-cyan-muted/20 group-hover:ring-${stat.color}-glow/40 transition-all`}>
                    {stat.icon}
                  </div>
                  <TrendingUp size={16} className="text-cyan-glow/40" />
                </div>
                <div className="font-display text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-[10px] font-mono text-textMuted uppercase tracking-widest">{stat.label}</div>
                
                <div className="mt-4 pt-4 border-t border-cyan-muted/10 flex items-center text-[10px] font-mono text-cyan-glow/60 italic">
                  <ArrowUpRight size={12} className="mr-1" />
                  +12.5% vs last month
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* System Health / Recent Activity Layout mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlowCard className="lg:col-span-2">
            <h3 className="font-display text-lg uppercase tracking-wider mb-8 flex items-center gap-2">
              <Activity className="text-cyan-glow" size={20} /> System Status
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Database Sync', status: 'Optimal', color: 'text-cyan-glow' },
                { label: 'CDN Connectivity', status: 'Stable', color: 'text-cyan-glow' },
                { label: 'Auth Gateway', status: 'Secure', color: 'text-cyan-glow' },
                { label: 'Broadcast Channel', status: 'Active', color: 'text-cyan-glow' },
              ].map((sys, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface/50 border border-cyan-muted/10 rounded-sm group hover:border-cyan-glow/30 transition-all">
                  <span className="text-sm font-mono uppercase text-textMuted">{sys.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono uppercase font-black ${sys.color}`}>{sys.status}</span>
                    <div className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          <GlowCard>
            <h3 className="font-display text-lg uppercase tracking-wider mb-8">Quick Actions</h3>
            <div className="flex flex-col gap-4">
              <button className="btn-outline text-xs py-4 text-center">Generate Stats Report</button>
              <button className="btn-outline text-xs py-4 text-center border-neonRed text-neonRed hover:bg-neonRed hover:text-background">Hard Reset Cache</button>
              <div className="mt-6 p-4 bg-background/50 border border-dashed border-cyan-muted/30 rounded-sm">
                <p className="text-[10px] font-mono text-textMuted leading-relaxed uppercase">
                  Terminal ID: OPERATOR_01 <br />
                  Permissions: ROOT_ACCESS <br />
                  Location: RIT_MAIN_HUB
                </p>
              </div>
            </div>
          </GlowCard>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
