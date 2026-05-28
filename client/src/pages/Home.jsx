// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import api from '../services/api';
import GlowCard from '../components/ui/GlowCard';
import NeonBadge from '../components/ui/NeonBadge';
import SectionHeader from '../components/ui/SectionHeader';
import CounterStat from '../components/ui/CounterStat';
import AntiGravityCard from '../components/ui/AntiGravityCard';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, annRes] = await Promise.all([
          api.get('/events?status=upcoming'),
          api.get('/announcements')
        ]);
        const eventsData = Array.isArray(eventsRes.data) ? eventsRes.data : [];
        const annData = Array.isArray(annRes.data) ? annRes.data : [];
        setEvents(eventsData.slice(0, 3));
        setAnnouncements(annData.slice(0, 2));
      } catch (err) {
        console.error('Home data fetch error:', err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchData();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  // Generic skeleton loader
  const renderSkeletons = (count) => (
    Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-64 bg-surface-2 animate-pulse border border-border" />
    ))
  );

  return (
    <div className="w-full">
      {/* ━━━ SECTION 1: HERO ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative w-full h-screen flex flex-col md:flex-row overflow-hidden bg-void border-b border-border">
        {/* Background Grids & Noise */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgNjBMMjAwMCA2ME02MCAwTDYwIDIwMDAiIHN0cm9rZT0iI2M4ZmYwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDgiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none" />
        
        {/* Giant RIT Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-heading text-[40vw] text-acid opacity-[0.03] leading-none">RIT</span>
        </div>

        {/* Left Side: 60% */}
        <motion.div 
          className="relative z-10 w-full md:w-[60%] h-full flex flex-col justify-center px-8 md:px-16"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="mb-4">
            <span className="font-subheading text-acid tracking-[0.2em] uppercase text-sm font-bold">
              RAMAIAH INSTITUTE OF TECHNOLOGY
            </span>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col leading-[0.85] mb-6">
            <span className="font-heading text-[10vw] text-text-0">CLUTCH</span>
            <span className="font-heading text-[10vw] text-acid" style={{ textShadow: 'var(--acid-glow)' }}>RIT</span>
            <span className="font-heading text-[3vw] text-text-1 tracking-[0.2em] mt-2">GAMING CLUB</span>
          </motion.div>

          {/* Thin acid line divider */}
          <motion.div variants={fadeUp} className="w-[80px] h-[1px] bg-acid mb-6 opacity-30" />

          <motion.p variants={fadeUp} className="font-body text-text-1 text-lg mb-10 max-w-md">
            Dominance. Precision. Elite status. We are the architects of the digital battlefield.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
            <a href="https://www.instagram.com/clutchrit.esports?igsh=MXgzdWNoc3g2MXU5Yw==" target="_blank" rel="noopener noreferrer" className="bg-acid text-void font-subheading font-bold uppercase tracking-widest px-[36px] py-[14px] hover:scale-105 hover:shadow-acid-glow transition-all duration-300">
              JOIN THE CLUB
            </a>
            <Link to="/events" className="border border-acid text-acid font-subheading font-bold uppercase tracking-widest px-[36px] py-[14px] hover:bg-acid-dim transition-all duration-300">
              EXPLORE EVENTS
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side: 40% */}
        <div className="hidden md:block relative z-10 w-[40%] h-full">
          {/* Geometric SVG Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 800" fill="none">
            <rect x="50" y="200" width="300" height="400" stroke="var(--acid)" strokeOpacity="0.3" strokeWidth="2" />
            <rect x="100" y="150" width="300" height="400" stroke="var(--acid)" strokeOpacity="0.2" strokeWidth="1" />
            <circle cx="250" cy="400" r="180" stroke="var(--fire)" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="0" y1="800" x2="500" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="0" y1="0" x2="500" y2="800" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          </svg>

          {/* Floating Stat Chips — wrapped in AntiGravityCard for independent drift */}
          <AntiGravityCard
            floatVariant="a"
            glowColor="cyan"
            delay={0.2}
            disableTilt
            className="absolute top-[20%] left-[10%]"
          >
            <div className="bg-surface-2 border border-border-bright p-4 transform rotate-[-2deg] bracketed-card">
              <p className="font-subheading text-text-1 text-xs uppercase tracking-widest mb-1">ACTIVE PLAYERS</p>
              <p className="font-mono text-acid text-2xl">—</p>
            </div>
          </AntiGravityCard>

          <AntiGravityCard
            floatVariant="b"
            glowColor="magenta"
            delay={0.8}
            disableTilt
            className="absolute top-[50%] right-[15%]"
          >
            <div className="bg-surface-2 border border-border-bright p-4 transform rotate-[3deg] bracketed-card">
              <p className="font-subheading text-text-1 text-xs uppercase tracking-widest mb-1">EVENTS HOSTED</p>
              <p className="font-mono text-acid text-2xl">—</p>
            </div>
          </AntiGravityCard>

          <AntiGravityCard
            floatVariant="c"
            glowColor="acid"
            delay={1.4}
            disableTilt
            className="absolute bottom-[20%] left-[20%]"
          >
            <div className="bg-surface-2 border border-border-bright p-4 transform rotate-[-1deg] bracketed-card">
              <p className="font-subheading text-text-1 text-xs uppercase tracking-widest mb-1">GAMES</p>
              <p className="font-mono text-acid text-2xl">6+</p>
            </div>
          </AntiGravityCard>
        </div>
      </section>

      {/* ━━━ SECTION 2: LIVE STATUS BAR ━━━━━━━━━━━━━ */}
      <section className="w-full bg-surface-1 border-y border-border py-6 px-6">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center md:border-r border-acid/20 border-dashed last:border-none">
            <p className="font-subheading text-text-1 text-[10px] uppercase tracking-widest mb-2">MEMBERS</p>
            <CounterStat value={0} label="" />
          </div>
          <div className="text-center md:border-r border-acid/20 border-dashed last:border-none">
            <p className="font-subheading text-text-1 text-[10px] uppercase tracking-widest mb-2">EVENTS</p>
            <CounterStat value={0} label="" />
          </div>
          <div className="text-center md:border-r border-acid/20 border-dashed last:border-none">
            <p className="font-subheading text-text-1 text-[10px] uppercase tracking-widest mb-2">SEASONS</p>
            <CounterStat value={0} label="" />
          </div>
          <div className="text-center border-none">
            <p className="font-subheading text-text-1 text-[10px] uppercase tracking-widest mb-2">ACTIVE NOW</p>
            <CounterStat value={0} label="" />
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 3: ABOUT THE CLUB (ANCHOR) ━━━━━━ */}
      <section id="about-section" className="py-24 container mx-auto px-6 border-b border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SectionHeader 
              title="MISSION : GENESIS" 
              subtitle="Born from the passion of RIT's most dedicated gamers, ClutchRIT bridges the gap between casual play and professional esports."
            />
            <div className="space-y-6 text-text-1 font-body leading-relaxed text-lg mt-8">
              <p>
                ClutchRIT isn't just a gaming club; it's a brotherhood of digital gladiators. Founded in 2019 at Ramaiah Institute of Technology, our goal was simple: provide a platform where gamers can hone their skills, find their team, and represent RIT on a national stage.
              </p>
              <p>
                From massive 5v5 Valorant tournaments to strategic Chess battles and mobile gaming showdowns, we cover the entire spectrum of competitive play. We believe that gaming is the ultimate test of cognitive skill, teamwork, and quick decision-making.
              </p>
            </div>
            
            <div className="mt-12 flex gap-8">
              <div>
                <span className="block font-heading text-4xl text-acid">EST. 2019</span>
                <span className="block font-mono text-[10px] text-text-2 uppercase tracking-widest">DEPLOYMENT DATE</span>
              </div>
              <div className="w-[1px] h-12 bg-border" />
              <div>
                <span className="block font-heading text-4xl text-fire">500+</span>
                <span className="block font-mono text-[10px] text-text-2 uppercase tracking-widest">OPERATIVES</span>
              </div>
            </div>
          </motion.div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-acid/10 blur-3xl rounded-full group-hover:bg-acid/20 transition-all duration-700" />
            <div className="relative border border-border bg-surface-1 overflow-hidden bracketed-card">
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200" 
                alt="ClutchRIT Team"
                className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700 aspect-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 4: FEATURED EVENTS ━━━━━━━━━━━━━ */}
      <section className="py-24 container mx-auto px-6">
        <div className="mb-12">
          <SectionHeader title="Upcoming Events" subtitle="" align="left" />
        </div>

        {loadingEvents ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{renderSkeletons(2)}</div>
        ) : events.length === 0 ? (
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 h-64 border-2 border-dashed border-border flex items-center justify-center p-6 text-center">
                <span className="font-mono text-text-2">Events coming soon...</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Large Card (Left - 55%) */}
            {events[0] && (
              <div className="lg:w-[55%] event-card group">
                <div className="relative h-56 w-full overflow-hidden bg-surface-2 border-b border-border">
                  {events[0].banner_image ? (
                    <img src={events[0].banner_image} alt={events[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl text-text-2">🎮</div>
                  )}
                  <div className="absolute top-4 left-4"><NeonBadge color="violet">{events[0].game || 'Open'}</NeonBadge></div>
                  <div className="absolute top-4 right-4"><NeonBadge color="acid">{events[0].status}</NeonBadge></div>
                </div>
                <div className="p-8 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-heading text-4xl text-text-0 mb-4">{events[0].title}</h3>
                    <div className="flex items-center gap-2 font-mono text-text-1 text-sm mb-2">
                      <Calendar size={16} className="text-acid" /> 
                      {new Date(events[0].date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-text-1 text-sm mb-4">
                      <MapPin size={16} className="text-fire" /> 
                      {events[0].location || 'TBA'}
                    </div>
                    {events[0].prizePool && (
                      <div className="flex items-center gap-2 font-mono text-acid text-lg font-bold mb-6">
                        <Trophy size={20} /> {events[0].prizePool}
                      </div>
                    )}
                  </div>
                  <Link to={`/events/${events[0].id}`} className="text-acid font-subheading uppercase tracking-widest hover:text-text-0 transition-colors mt-4 inline-block">
                    VIEW EVENT →
                  </Link>
                </div>
              </div>
            )}

            {/* Small Stacked Cards (Right - 45%) */}
            <div className="lg:w-[45%] flex flex-col gap-6">
              {events.slice(1, 3).map(event => (
                <div key={event.id} className="event-card h-full">
                  <div className="flex flex-col sm:flex-row w-full h-full">
                    {/* Small image block */}
                    <div className="sm:w-[30%] h-48 sm:h-auto relative bg-surface-2 overflow-hidden border-b sm:border-b-0 sm:border-r border-border">
                      {event.banner_image ? (
                        <img src={event.banner_image} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl text-text-2">🎮</div>
                      )}
                    </div>
                    {/* Small content block */}
                    <div className="p-6 sm:w-[70%] flex flex-col justify-center">
                      <div className="flex gap-2 mb-3">
                        <NeonBadge color="violet" className="text-[10px]">{event.game}</NeonBadge>
                        <NeonBadge color="acid" className="text-[10px]">{event.status}</NeonBadge>
                      </div>
                      <h4 className="font-heading text-2xl text-text-0 mb-2 truncate">{event.title}</h4>
                      <p className="font-mono text-text-1 text-xs flex items-center gap-2 mb-4">
                        <Calendar size={14} className="text-acid" /> 
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      <Link to={`/events/${event.id}`} className="text-acid font-subheading uppercase text-sm tracking-widest hover:text-text-0 transition-colors mt-auto inline-block">
                        VIEW EVENT →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ━━━ SECTION 4: ANNOUNCEMENTS STRIP ━━━━━━━━ */}
      <section className="diagonal-section-left bg-surface-1 py-32 px-6 border-y border-border">
        <div className="container mx-auto">
          <SectionHeader title="LATEST DROPS" subtitle="" align="left" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {announcements.length === 0 ? (
              <div className="col-span-2 text-center p-12 border border-border border-dashed font-mono text-text-2">
                No announcements yet.
              </div>
            ) : (
              announcements.map(ann => (
                <div key={ann.id} className="flex bg-void border border-border group hover:border-acid transition-colors duration-300">
                  <div className="w-12 flex items-center justify-center border-r border-border bg-surface-2 overflow-hidden group-hover:bg-acid-dim transition-colors">
                    <span className="transform -rotate-90 whitespace-nowrap font-subheading uppercase tracking-widest text-acid text-xs">
                      {ann.type || 'GENERAL'}
                    </span>
                  </div>
                  <div className="p-6 flex-1">
                    <p className="font-mono text-[10px] text-text-1 mb-2">
                      {new Date(ann.date).toLocaleDateString()}
                    </p>
                    <h4 className="font-heading text-2xl text-text-0 mb-3 group-hover:text-acid transition-colors">
                      {ann.title}
                    </h4>
                    <p className="font-body text-text-1 line-clamp-2 text-sm">
                      {ann.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-8 text-right">
            <Link to="/announcements" className="text-acid font-subheading uppercase tracking-widest hover:text-text-0 transition-colors">
              VIEW ALL ANNOUNCEMENTS →
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ SECTION 5: GAMES WE PLAY ━━━━━━━━━━━━━━ */}
      <section className="py-24 container mx-auto px-6">
        <SectionHeader title="OUR GAMES" subtitle="" align="left" />
        
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12 pb-8 scrollbar-hide">
          {[
            { name: 'Valorant', emoji: '🎯' },
            { name: 'BGMI', emoji: '📱' },
            { name: 'Minecraft', emoji: '⛏️' },
            { name: 'Free Fire', emoji: '🔫' },
            { name: 'Chess', emoji: '♟️' },
            { name: 'More', emoji: '🎮' },
          ].map(game => (
            <div key={game.name} className="bracketed-card min-w-[200px] md:min-w-0 bg-surface-0 border border-border flex flex-col items-center justify-center p-8 text-center group hover:bg-acid-dim hover:border-acid transition-all duration-300">
              <span className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300 grayscale group-hover:grayscale-0">{game.emoji}</span>
              <h5 className="font-heading text-2xl text-text-0 group-hover:text-acid transition-colors tracking-wide">{game.name}</h5>
              <span className="font-mono text-text-2 text-[10px] uppercase mt-2">— Players</span>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ SECTION 6: CALL TO ACTION BANNER ━━━━━━ */}
      <section className="diagonal-section-right bg-acid py-32 px-6 flex flex-col items-center justify-center text-center">
        <h2 className="font-heading text-5xl md:text-[6vw] text-void leading-none mb-4">THINK YOU'RE BUILT FOR THIS?</h2>
        <p className="font-body text-void/80 text-xl md:text-2xl mb-12 max-w-2xl">
          We don't just play. We dominate. Join the ranks.
        </p>
        <a href="https://www.instagram.com/clutchrit.esports?igsh=MXgzdWNoc3g2MXU5Yw==" target="_blank" rel="noopener noreferrer" className="bg-void text-acid font-subheading font-bold uppercase tracking-widest px-12 py-4 hover:scale-105 transition-transform duration-300">
          APPLY NOW →
        </a>
      </section>
    </div>
  );
};

export default Home;
