// src/pages/Announcements.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/ui/SectionHeader';
import api from '../services/api';
import { Megaphone, Calendar, ChevronRight, Pin } from 'lucide-react';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await api.get('/announcements');
        setAnnouncements(data);
      } catch (err) {
        console.error('Announcements fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-void min-h-screen text-text-0 pb-32">
      {/* Header */}
      <section className="pt-48 pb-24 border-b border-border bg-gradient-to-b from-surface-1 to-void relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-4">
            <div className="w-12 h-1 bg-acid" />
            <span className="font-subheading text-acid uppercase tracking-[0.4em] text-sm">COMM_CENTER</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-heading text-[10vw] leading-none mb-4"
          >
            LATEST <span className="text-fire" style={{ textShadow: 'var(--fire-glow)' }}>DROPS</span>
          </motion.h1>
          <p className="font-body text-text-1 text-lg max-w-xl">
            Critical intelligence, system updates, and recruitment notices. Stay synchronized.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-24">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-surface-1 animate-pulse border border-border" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-32 border border-dashed border-border opacity-50">
            <Megaphone className="w-16 h-16 mx-auto mb-6" />
            <h3 className="font-heading text-4xl uppercase">NO DROPS IN SECTOR</h3>
            <p className="font-mono text-xs mt-2">MONITORING FOR UPDATES...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {announcements.map((ann, index) => (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex bg-surface-1 border border-border relative overflow-hidden transition-all group hover:border-acid/50 ${ann.is_pinned ? 'border-l-8 border-l-fire shadow-fire-glow/10' : ''}`}
              >
                {/* Visual Accent */}
                <div className="w-2 flex-shrink-0 bg-surface-2" />
                
                {/* Content Area */}
                <div className="p-8 md:p-12 flex-1 relative">
                  {ann.is_pinned && (
                    <div className="absolute top-4 right-8 flex items-center gap-2 text-fire font-subheading text-xs tracking-widest">
                       <Pin size={14} className="rotate-45" /> PINNED_PRIORITY
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className={`px-3 py-1 font-mono text-[10px] uppercase border tracking-widest
                      ${ann.type === 'URGENT' ? 'border-fire text-fire bg-fire-dim/10' : 
                        ann.type === 'RECRUITMENT' ? 'border-ice text-ice bg-ice-dim/10' : 
                        ann.type === 'EVENT' ? 'border-acid text-acid bg-acid-dim/10' : 
                        'border-border text-text-2'}
                    `}>{ann.type || 'GENERAL'}</span>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-2 uppercase">
                      <Calendar size={12} className="text-acid" /> 
                      {new Date(ann.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  <h2 className="font-heading text-4xl md:text-5xl text-text-0 mb-6 group-hover:text-acid transition-colors uppercase italic tracking-tighter">
                    {ann.title}
                  </h2>
                  
                  <div className="font-body text-text-1 text-lg leading-relaxed mb-8 max-w-4xl whitespace-pre-wrap">
                    {ann.content}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <span className="font-mono text-[8px] text-text-2 uppercase tracking-[0.5em]">SYSTEM_AUTH :: ENCRYPTED</span>
                    <div className="w-12 h-[1px] bg-border flex-1 mx-8 hidden md:block" />
                    <button className="text-acid font-subheading text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all">
                      ACKNOWLEDGMENT_LOG <ChevronRight size={14} />
                    </button>
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

export default Announcements;
