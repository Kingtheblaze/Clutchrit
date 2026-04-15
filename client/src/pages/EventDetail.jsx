// src/pages/EventDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlowCard from '../components/ui/GlowCard';
import NeonBadge from '../components/ui/NeonBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../services/api';
import { Calendar, Trophy, MapPin, Users, ChevronLeft, ExternalLink, Info, ShieldCheck } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError('Mission data could not be retrieved.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error || !event) return (
    <div className="py-32 text-center">
      <h2 className="text-3xl font-display font-black text-neonRed uppercase mb-6">Access Denied</h2>
      <p className="text-textMuted mb-8">{error || 'Mission not found.'}</p>
      <Link to="/events" className="btn-outline">Return to Operations</Link>
    </div>
  );

  return (
    <div className="py-12 container mx-auto px-6 min-h-screen">
      <Link to="/events" className="inline-flex items-center gap-2 text-textMuted hover:text-cyan-glow transition-colors font-mono text-xs uppercase tracking-widest mb-12 group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Missions
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Image and Main Info */}
        <div className="lg:col-span-2 space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-lg overflow-hidden border border-cyan-glow/30"
          >
            <img 
              src={event.bannerImage || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200"} 
              alt={event.title}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex flex-wrap gap-4 mb-4">
                <NeonBadge color="red">{event.game}</NeonBadge>
                <NeonBadge color="violet">{event.status}</NeonBadge>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase italic drop-shadow-lg">
                {event.title}
              </h1>
            </div>
          </motion.div>

          {/* Description Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-cyan-muted/20 pb-4">
              <Info className="text-cyan-glow" size={24} />
              <h2 className="font-display text-2xl uppercase italic tracking-tight">Mission Briefing</h2>
            </div>
            <div className="text-textMuted font-body text-lg leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
            {event.rules && (
              <div className="mt-12 p-8 glass-panel border-l-4 border-l-neonRed">
                <h3 className="font-display text-xl uppercase mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-neonRed" size={24} /> Rules of Engagement
                </h3>
                <div className="text-textMuted font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {event.rules}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Sidebar Stats & Register */}
        <div className="space-y-8">
          <GlowCard className="border-t-4 border-t-cyan-glow sticky top-32">
            <h3 className="font-display text-xl uppercase mb-8 tracking-widest border-b border-cyan-muted/20 pb-4">Mission Intel</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-cyan-glow/10 rounded flex items-center justify-center text-cyan-glow">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-textMuted uppercase">Operation Date</p>
                  <p className="font-display text-sm font-bold">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-cyan-glow/10 rounded flex items-center justify-center text-cyan-glow">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-textMuted uppercase">Sector / Location</p>
                  <p className="font-display text-sm font-bold">{event.location || 'RIT Main Hub'}</p>
                </div>
              </div>

              {event.prizePool && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-cyan-glow/10 rounded flex items-center justify-center text-cyan-glow">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-textMuted uppercase">Prize Bounty</p>
                    <p className="font-display text-lg font-black text-cyan-glow animate-pulse tracking-tight">{event.prizePool}</p>
                  </div>
                </div>
              )}

              <div className="pt-8 flex flex-col gap-4">
                {event.status === 'upcoming' ? (
                  <a 
                    href={event.registrationLink || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center gap-2 group"
                  >
                    INITIATE REGISTRATION <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                ) : (
                  <button disabled className="btn-outline w-full opacity-50 cursor-not-allowed">
                    RECRUITMENT CLOSED
                  </button>
                )}
                
                <p className="text-[10px] text-center font-mono text-textMuted uppercase">
                  Verify mission details before deploying.
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Share Mission */}
          <div className="p-6 border border-cyan-muted/20 rounded-sm">
            <h4 className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-glow mb-4">Signal Share</h4>
            <div className="flex gap-4">
              <button className="text-textMuted hover:text-cyan-glow transition-colors underline underline-offset-4 text-xs font-mono">LINK_URL</button>
              <button className="text-textMuted hover:text-cyan-glow transition-colors underline underline-offset-4 text-xs font-mono">DISCORD_PING</button>
              <button className="text-textMuted hover:text-cyan-glow transition-colors underline underline-offset-4 text-xs font-mono">INSTA_STORY</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
