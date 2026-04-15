// src/pages/Events.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/ui/SectionHeader';
import GlowCard from '../components/ui/GlowCard';
import NeonBadge from '../components/ui/NeonBadge';
import api from '../services/api';
import { Calendar, Trophy, MapPin, Search, ChevronRight, Ghost } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data);
      } catch (err) {
        console.error('Events fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesStatus = filter === 'all' || event.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.game && event.game.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-void min-h-screen text-text-0 pb-32">
      {/* Page Header */}
      <section className="pt-48 pb-24 border-b border-border bg-surface-1 diagonal-section-left overflow-hidden relative">
        <div className="noise-overlay" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-heading text-[10vw] leading-none mb-2 underline decoration-acid decoration-8 underline-offset-10"
          >
            MISSIONS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-subheading text-text-1 uppercase tracking-[0.4em] text-lg max-w-2xl"
          >
            CURRENT AND UPCOMING DEPLOYMENT LOGS. COORDINATE WITH YOUR TEAM.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-16 items-center justify-between border border-border p-6 bg-surface-0 shadow-2xl">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-2 group-focus-within:text-acid transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH BY MISSION OR GAME..."
              className="w-full bg-void border border-border text-text-0 pl-12 pr-4 py-3 font-mono text-xs focus:border-acid focus:outline-none placeholder-text-2 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status.toLowerCase())}
                className={`flex-1 md:flex-none px-6 py-2 font-subheading text-xs uppercase tracking-widest border transition-all ${
                  filter === status.toLowerCase() 
                  ? 'bg-acid text-void border-acid shadow-acid-glow' 
                  : 'text-text-1 border-border hover:border-text-1'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-surface-1 h-[450px] animate-pulse border border-border" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-border flex flex-col items-center">
            <Ghost className="w-16 h-16 text-text-2 mb-6 opacity-30" />
            <h3 className="font-heading text-4xl text-text-2 uppercase">NO ACTIVE MISSIONS</h3>
            <p className="font-mono text-text-2 text-xs mt-2 uppercase tracking-widest">SECTOR CLEAR :: CHECK BACK SOON</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="event-card group flex flex-col h-full bg-surface-1 border border-border relative overflow-hidden"
              >
                <div className="relative h-52 overflow-hidden border-b border-border">
                  {event.banner_image ? (
                    <img 
                      src={event.banner_image} 
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-2 flex items-center justify-center font-heading text-6xl text-text-2 opacity-50">🎮</div>
                  )}
                  {/* Glassy Tag Overlays */}
                  <div className="absolute top-4 left-4">
                    <NeonBadge color={event.status === 'UPCOMING' ? 'acid' : event.status === 'ONGOING' ? 'fire' : 'violet'}>
                      {event.status}
                    </NeonBadge>
                  </div>
                  {event.game && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-void/80 backdrop-blur-md border border-border/50 text-text-0 px-3 py-1 font-mono text-[10px] uppercase">
                        {event.game}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex gap-4 mb-6 border-b border-border/50 pb-4">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-2 uppercase">
                      <Calendar size={12} className="text-acid" /> 
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-2 uppercase">
                      <MapPin size={12} className="text-fire" /> 
                      {event.location || 'RIT CAMPUS'}
                    </div>
                  </div>

                  <h3 className="text-3xl font-heading mb-4 leading-none group-hover:text-acid transition-colors uppercase tracking-tight">
                    {event.title}
                  </h3>
                  
                  <p className="text-text-1 text-sm font-body line-clamp-3 mb-8 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    {event.prize_pool && (
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-text-2 uppercase tracking-widest">EST. REWARDS</span>
                        <span className="text-2xl font-heading text-acid flex items-center gap-1">
                          {event.prize_pool}
                        </span>
                      </div>
                    )}
                    <Link 
                      to={`/events/${event.id}`}
                      className="flex-1 text-center bg-void border border-acid text-acid font-subheading text-[10px] p-3 uppercase tracking-[0.2em] hover:bg-acid hover:text-void transition-all duration-300 shadow-[2px_2px_0px_var(--acid-dim)] group-hover:shadow-[4px_4px_0px_var(--acid)]"
                    >
                      BATTLE_BRIEFING →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
