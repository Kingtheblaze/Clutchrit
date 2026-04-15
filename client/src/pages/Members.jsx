// src/pages/Members.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaDiscord, FaGhost } from 'react-icons/fa';
import api from '../services/api';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await api.get('/members');
        let data = res.data;
        if (!Array.isArray(data)) data = [];
        data.sort((a, b) => (a.order || 999) - (b.order || 999));
        setMembers(data);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const executives = members.filter(m => m.isExecutive);
  
  // Extract all unique games from all members
  const allGamesSet = new Set();
  members.forEach(m => {
    if (m.games && Array.isArray(m.games)) {
      m.games.forEach(g => allGamesSet.add(g));
    }
  });
  const allGames = Array.from(allGamesSet);
  const filters = ['ALL', ...allGames];

  const filteredMembers = activeFilter === 'ALL' 
    ? members 
    : members.filter(m => m.games && m.games.includes(activeFilter));

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.08 } }
  };

  // Generic skeleton loader matching card dimensions
  const renderSkeletons = (count, isExecutive = false) => (
    Array.from({ length: count }).map((_, i) => (
      <div 
        key={i} 
        className={`bg-surface-1 border border-border overflow-hidden relative ${isExecutive ? 'w-[200px] aspect-[3/4]' : 'aspect-square md:aspect-[3/4]'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1 animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
      </div>
    ))
  );

  return (
    <div className="w-full bg-void min-h-screen pb-32">
      {/* ━━━ PAGE HEADER ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="diagonal-section-right relative w-full pt-48 pb-32 bg-surface-0 border-b border-border overflow-hidden">
        {/* Faint acid grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgNjBMMjAwMCA2ME02MCAwTDYwIDIwMDAiIHN0cm9rZT0iI2M4ZmYwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDQiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none" />
        <div className="noise-overlay" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-[8vw] leading-none text-text-0 glitch-hover"
            data-text="THE ROSTER"
          >
            THE ROSTER
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-subheading text-acid tracking-[0.4em] uppercase mt-2 text-xl"
          >
            CLUTCHRIT · SEASON {new Date().getFullYear()}
          </motion.div>
        </div>
      </section>

      {/* ━━━ SECTION 1: EXECUTIVE CORE ━━━━━━━━━━━━ */}
      <section className="container mx-auto px-6 py-24 border-b border-border border-dashed">
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-acid/30" />
            <h2 className="font-subheading text-acid uppercase tracking-[0.3em] text-xl font-bold">EXECUTIVE CORE</h2>
            <div className="w-12 h-[1px] bg-acid/30" />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-6">
            {renderSkeletons(5, true)}
          </div>
        ) : executives.length === 0 ? (
          <div className="text-center w-full py-12 flex flex-col items-center justify-center">
            <FaGhost className="text-6xl text-acid mb-4 opacity-50" />
            <h3 className="font-heading text-4xl text-text-2">ROSTER BEING ASSEMBLED</h3>
            <p className="font-body text-text-1 mt-2">Check back soon.</p>
          </div>
        ) : (
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-wrap justify-center gap-6"
          >
            {executives.map((member, index) => (
              <motion.div 
                key={member.id}
                variants={fadeUp}
                className="member-card w-[200px] aspect-[3/4] group flex-shrink-0"
              >
                {/* Photo Container */}
                <div className="member-photo-container">
                  <div className="absolute top-0 right-0 z-10 bg-acid text-void font-mono text-xs px-2 py-1 font-bold">
                    #{String(index + 1).padStart(2, '0')}
                  </div>
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-2 text-4xl text-text-2 group-hover:grayscale-0 grayscale transition-all duration-500">
                      👤
                    </div>
                  )}
                  <div className="acid-overlay" />
                  
                  {/* Bio Slide-up overlay */}
                  <div className="absolute -bottom-full left-0 w-full p-4 bg-surface-2/95 backdrop-blur-md transition-all duration-300 group-hover:bottom-0 border-t border-acid/20 flex flex-col h-full justify-end pb-8">
                    <p className="font-body text-xs text-text-0 mb-4 line-clamp-4">
                      {member.bio || "No bio available."}
                    </p>
                    <div className="flex gap-4">
                      {member.socials?.instagram && (
                        <a href={`https://instagram.com/${member.socials.instagram}`} target="_blank" rel="noopener noreferrer" className="text-acid hover:text-text-0 transition-colors">
                          <FaInstagram size={18} />
                        </a>
                      )}
                      {member.socials?.discord && (
                        <span className="text-acid hover:text-text-0 cursor-help transition-colors" title={member.socials.discord}>
                          <FaDiscord size={18} />
                        </span>
                      )}
                      {member.socials?.linkedin && (
                        <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-acid hover:text-text-0 transition-colors">
                          <FaLinkedin size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Info Strip */}
                <div className="member-info bg-surface-2 flex-1 border-t border-border group-hover:border-acid/30 transition-colors z-20">
                  <h3 className="font-subheading text-lg font-bold text-text-0 uppercase truncate mb-1 leading-tight">{member.name}</h3>
                  <p className="font-mono text-acid text-[10px] uppercase truncate mb-2">{member.role}</p>
                  <div className="flex flex-wrap gap-1">
                    {(member.games || []).slice(0,3).map((g, i) => (
                      <span key={i} className="text-xs opacity-70" title={g}>🎮</span> /* Using generic icon due to lack of mapped emoji in DB usually */
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ━━━ SECTION 2: ALL MEMBERS GRID ━━━━━━━━━━━ */}
      <section className="container mx-auto px-6 py-24">
        <div className="flex justify-center flex-col items-center mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-fire/30" />
            <h2 className="font-subheading text-text-0 uppercase tracking-[0.3em] text-xl font-bold glitch-hover" data-text="ALL MEMBERS">ALL MEMBERS</h2>
            <div className="w-12 h-[1px] bg-fire/30" />
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`font-subheading uppercase text-sm tracking-widest px-4 py-1 transition-all duration-300 ${
                  activeFilter === filter 
                    ? 'bg-acid text-void' 
                    : 'bg-transparent border border-border text-text-1 hover:border-border-bright'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {renderSkeletons(10, false)}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center w-full py-24">
            <p className="font-mono text-text-2 text-lg">No members found for filter '{activeFilter}'.</p>
          </div>
        ) : (
          <motion.div 
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {filteredMembers.map((member) => (
              <motion.div 
                key={member.id}
                variants={fadeUp}
                className="member-card aspect-[3/4] group border border-border hover:border-fire/50"
              >
                {/* Regular Member Hover - Fire Glow Instead of Acid */}
                <style>{`
                  .member-card:hover {
                    box-shadow: ${member.isExecutive ? 'var(--acid-glow)' : 'var(--fire-glow)'};
                  }
                `}</style>
                
                <div className="member-photo-container">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="grayscale group-hover:grayscale-0 transition-all duration-500 w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-2 text-4xl text-text-2 group-hover:text-text-1 group-hover:grayscale-0 grayscale transition-all duration-500">
                      👤
                    </div>
                  )}
                  {/* Subtle ice overlay instead of acid for non-execs to differentiate */}
                  <div className="absolute inset-0 bg-ice opacity-0 group-hover:opacity-10 mix-blend-color transition-opacity duration-500 pointer-events-none" />
                </div>
                
                <div className="bg-surface-1 flex-1 p-3 border-t border-border group-hover:bg-surface-2 transition-colors flex flex-col justify-between">
                  <div>
                    <h3 className="font-subheading text-base font-bold text-text-0 uppercase truncate leading-none mb-1">{member.name}</h3>
                    <p className="font-mono text-[10px] text-text-1 uppercase truncate mb-2">{member.role}</p>
                  </div>
                  <div className="flex gap-2 text-text-2 pt-2 border-t border-border/50 text-[10px] font-mono">
                    <span>{member.year || 'N/A'}</span>
                    <span>•</span>
                    <span className="truncate">{member.branch || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Members;
