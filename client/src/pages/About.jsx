// src/pages/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/ui/SectionHeader';
import GlowCard from '../components/ui/GlowCard';
import NeonBadge from '../components/ui/NeonBadge';
import { Target, Eye, Shield, Zap, Award, MessageSquare, Trophy, Cpu } from 'lucide-react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-void min-h-screen text-text-0">
      {/* Hero Header */}
      <section className="pt-48 pb-24 border-b border-border text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgNjBMMjAwMCA2ME02MCAwTDYwIDIwMDAiIHN0cm9rZT0iI2M4ZmYwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-heading text-[12vw] leading-none mb-4"
          >
            WHO WE <span className="text-acid" style={{ textShadow: 'var(--acid-glow)' }}>ARE</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-subheading text-text-1 uppercase tracking-[0.4em] text-xl"
          >
            CLUTCHRIT // ELITE ESPORTS LOGISTICS
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-24">
        {/* Club Story Section */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <SectionHeader 
                title="THE GENESIS" 
                subtitle="Born from the passion of RIT's most dedicated gamers, ClutchRIT was founded to bridge the gap between casual play and professional esports."
              />
              <div className="space-y-6 text-text-1 font-body leading-relaxed text-lg mt-8">
                <p>
                  ClutchRIT isn't just a gaming club; it's a brotherhood of digital gladiators. Founded in 2019 at Ramaiah Institute of Technology, our goal was simple: provide a platform where gamers can hone their skills, find their team, and represent RIT on a national stage.
                </p>
                <p>
                  From massive 5v5 Valorant tournaments to strategic Chess battles and mobile gaming showdowns, we cover the entire spectrum of competitive play. We believe that gaming is the ultimate test of cognitive skill, teamwork, and quick decision-making.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-acid/10 blur-3xl rounded-full" />
              <div className="relative border border-border bg-surface-1 p-2 bracketed-card">
                <img 
                  src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1200" 
                  alt="Gaming Club Session"
                  className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-surface-2 border border-border p-6 border-l-4 border-l-acid hidden md:block">
                <div className="text-3xl font-heading text-acid">EST. 2019</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-2 text-right">INITIATED_DATE</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlowCard className="border-t-4 border-t-acid bg-surface-1">
              <Target className="text-acid mb-6" size={40} />
              <h3 className="text-3xl font-heading mb-4 uppercase tracking-tighter">OUR MISSION</h3>
              <p className="text-text-1 font-body leading-relaxed text-lg">
                To cultivate a professional gaming ecosystem within RIT that identifies, trains, and promotes talent across multiple disciplines. We aim to turn high-potential gamers into campus icons through organized competition and mentorship.
              </p>
            </GlowCard>

            <GlowCard className="border-t-4 border-t-fire bg-surface-1">
              <Eye className="text-fire mb-6" size={40} />
              <h3 className="text-3xl font-heading mb-4 uppercase tracking-tighter">OUR VISION</h3>
              <p className="text-text-1 font-body leading-relaxed text-lg">
                To be recognized as the premier collegiate gaming organization in South India, setting the standard for institutional esports and fostering a community where passion for gaming is celebrated as a high-level skill.
              </p>
            </GlowCard>
          </div>
        </section>

        {/* Advantage Grid */}
        <section className="mb-32">
          <SectionHeader align="center" title="THE ADVANTAGE" subtitle="Unlock exclusive benefits when you sync with the ClutchRIT network." />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: <Shield />, title: "ELITE NETWORK", desc: "Connect with RIT's top-ranked players and core teams." },
              { icon: <Zap />, title: "INFRASTRUCTURE", desc: "Access to optimized setups and private scrim channels via Discord." },
              { icon: <Award />, title: "CAMPUS GLORY", desc: "Represent RIT in national inter-college tournaments." },
              { icon: <Cpu />, title: "TECH FIRST", desc: "Leveraging custom tools and analytics for performance tracking." },
              { icon: <Trophy />, title: "PRIZE POOLS", desc: "Compete for significant rewards in our internal circuits." },
              { icon: <MessageSquare />, title: "MENTORSHIP", desc: "Get coached by seniors who've mastered the competitive grind." },
            ].map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="h-full bg-surface-0 border border-border p-8 group hover:border-acid/50 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-2 bg-acid/20" />
                  <div className="text-acid mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {React.cloneElement(item.icon, { size: 36 })}
                  </div>
                  <h4 className="font-heading text-2xl mb-3 tracking-wide">{item.title}</h4>
                  <p className="text-sm text-text-2 font-body leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Faculty Advisor Section */}
        <section className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-surface-1 border border-border p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 font-mono text-[8px] opacity-10 leading-none">
              FACULTY_AUTH_01<br/>CLASS_LEVEL_A
            </div>
            <div className="w-48 h-48 border border-acid p-1 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" 
                alt="Faculty Advisor"
                className="w-full h-full object-cover grayscale brightness-75"
              />
            </div>
            <div className="text-center md:text-left">
              <div className="inline-block border border-acid text-acid font-mono text-[10px] px-3 py-1 uppercase mb-4">FACULTY ADVISOR</div>
              <h3 className="text-4xl font-heading mb-3 underline decoration-acid decoration-4 underline-offset-8">DR. RAMESH KUMAR</h3>
              <p className="text-text-1 font-body mb-8 text-xl italic leading-relaxed">
                "Gaming is the bridge between technology and team dynamics. In the digital arena, we build the leaders of tomorrow."
              </p>
              <div className="font-mono text-xs uppercase tracking-widest text-text-2">
                Dept. of Computer Science & Engineering, RIT
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
