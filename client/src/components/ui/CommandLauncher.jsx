// src/components/ui/CommandLauncher.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Calendar,
  Users,
  Megaphone,
  BarChart3,
  Zap,
  ArrowRight,
  X,
  Command,
} from 'lucide-react';

// ─── Command definitions ────────────────────────────────────────────────────
const COMMANDS = [
  {
    id: 'tournaments',
    label: 'Active Tournaments',
    sub: 'Browse live & upcoming events',
    icon: Trophy,
    path: '/events',
    accentColor: 'var(--neon-cyan)',
    preview: {
      heading: 'Tournament Hub',
      body: 'View all live and upcoming ClutchRIT tournaments. Check registration links, prize pools, and game categories.',
      tag: 'EVENTS',
    },
  },
  {
    id: 'schedule',
    label: 'Match Schedule',
    sub: 'Full event calendar',
    icon: Calendar,
    path: '/events',
    accentColor: 'var(--neon-magenta)',
    preview: {
      heading: 'Match Schedule',
      body: 'Keep track of every scheduled match. Filter by game, date, and event status in the Events page.',
      tag: 'CALENDAR',
    },
  },
  {
    id: 'roster',
    label: 'Member Roster',
    sub: 'Full player directory',
    icon: Users,
    path: '/members',
    accentColor: 'var(--acid)',
    preview: {
      heading: 'Player Roster',
      body: 'Explore all ClutchRIT members — their roles, games, bios, and social links. Meet the squad.',
      tag: 'MEMBERS',
    },
  },
  {
    id: 'leaderboards',
    label: 'Announcements',
    sub: 'Latest drops from HQ',
    icon: Megaphone,
    path: '/announcements',
    accentColor: 'var(--fire)',
    preview: {
      heading: 'Announcements Feed',
      body: 'Stay locked in — pinned announcements, urgent updates, and general club news straight from the top.',
      tag: 'DROPS',
    },
  },
  {
    id: 'stats',
    label: 'Club Stats',
    sub: 'Performance overview',
    icon: BarChart3,
    path: '/',
    accentColor: 'var(--ice)',
    preview: {
      heading: 'Club Overview',
      body: 'See live counters for active members, events hosted, seasons run, and more on the Home dashboard.',
      tag: 'STATS',
    },
  },
];

// ─── Floating Action Button ──────────────────────────────────────────────────
const FAB = ({ onClick }) => (
  <motion.button
    id="ag-command-launcher-fab"
    onClick={onClick}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
    whileHover={{ scale: 1.12 }}
    whileTap={{ scale: 0.92 }}
    className="fixed bottom-8 right-8 z-[8000] w-14 h-14 rounded-full flex items-center justify-center group"
    aria-label="Open Command Launcher (Ctrl+K)"
    title="Command Launcher — Ctrl+K"
    style={{
      background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(255,0,127,0.15))',
      border: '1px solid rgba(0,240,255,0.35)',
      boxShadow: '0 0 24px rgba(0,240,255,0.2), 0 0 60px rgba(0,240,255,0.06)',
    }}
  >
    {/* Animated outer ring */}
    <span className="ag-fab-ring" />
    {/* Second pulse ring with delay */}
    <span
      className="ag-fab-ring"
      style={{ animationDelay: '1.25s', borderColor: 'rgba(255,0,127,0.35)' }}
    />
    <Zap
      size={22}
      className="text-neon-cyan group-hover:text-white transition-colors duration-200 relative z-10"
      style={{ filter: 'drop-shadow(0 0 8px var(--neon-cyan))' }}
    />
  </motion.button>
);

// ─── Hotkey hint chip ────────────────────────────────────────────────────────
const HotkeyChip = ({ label }) => (
  <span
    className="inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
    style={{
      background: 'rgba(0,240,255,0.08)',
      border: '1px solid rgba(0,240,255,0.2)',
      color: 'var(--neon-cyan)',
    }}
  >
    {label}
  </span>
);

// ─── Preview Panel ───────────────────────────────────────────────────────────
const PreviewPanel = ({ command }) => {
  const navigate = useNavigate();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={command.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col justify-between h-full p-6"
      >
        {/* Tag */}
        <div>
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4 inline-block"
            style={{ color: command.accentColor }}
          >
            ⬡ {command.preview.tag}
          </span>
          <h3
            className="font-heading text-3xl mb-4 leading-none"
            style={{
              color: 'var(--text-0)',
              textShadow: `0 0 12px ${command.accentColor}66`,
            }}
          >
            {command.preview.heading}
          </h3>
          <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-1)' }}>
            {command.preview.body}
          </p>
        </div>

        {/* Decorative geometric lines */}
        <svg
          className="absolute bottom-24 right-6 opacity-10 pointer-events-none"
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
        >
          <circle cx="60" cy="60" r="55" stroke={command.accentColor} strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="60" cy="60" r="35" stroke={command.accentColor} strokeWidth="1" />
          <line x1="60" y1="0" x2="60" y2="120" stroke={command.accentColor} strokeWidth="0.5" />
          <line x1="0" y1="60" x2="120" y2="60" stroke={command.accentColor} strokeWidth="0.5" />
        </svg>

        {/* Navigate CTA */}
        <motion.button
          onClick={() => navigate(command.path)}
          whileHover={{ x: 4 }}
          className="flex items-center gap-2 font-subheading text-sm uppercase tracking-widest mt-6 self-start"
          style={{ color: command.accentColor }}
        >
          <span>Launch</span>
          <ArrowRight size={14} />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Modal ──────────────────────────────────────────────────────────────
const LauncherModal = ({ onClose }) => {
  const [active, setActive] = useState(0);
  const [firedId, setFiredId] = useState(null);
  const navigate = useNavigate();
  const listRef = useRef(null);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') setActive((p) => Math.min(p + 1, COMMANDS.length - 1));
      if (e.key === 'ArrowUp') setActive((p) => Math.max(p - 1, 0));
      if (e.key === 'Enter') {
        const cmd = COMMANDS[active];
        fireAndNavigate(cmd);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, onClose]);

  const fireAndNavigate = useCallback((cmd) => {
    setFiredId(cmd.id);
    setTimeout(() => {
      onClose();
      navigate(cmd.path);
    }, 420);
  }, [navigate, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,5,7,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      {/* Modal panel */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 12 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="ag-glass-panel w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden relative"
        style={{ boxShadow: '0 0 60px rgba(0,240,255,0.12), 0 0 120px rgba(255,0,127,0.07)' }}
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: 'rgba(0,240,255,0.12)' }}
        >
          <div className="flex items-center gap-3">
            <Zap size={14} style={{ color: 'var(--neon-cyan)' }} />
            <span className="font-mono text-[11px] tracking-[0.25em] uppercase" style={{ color: 'var(--text-1)' }}>
              ClutchRIT // Command Interface
            </span>
          </div>
          <div className="flex items-center gap-3">
            <HotkeyChip label="↑↓ Navigate" />
            <HotkeyChip label="⏎ Launch" />
            <HotkeyChip label="Esc Close" />
            <button onClick={onClose} className="ml-2 text-text-2 hover:text-text-0 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body: dual-pane */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Left: Command list */}
          <div
            ref={listRef}
            className="w-[52%] flex flex-col overflow-y-auto border-r py-3"
            style={{ borderColor: 'rgba(0,240,255,0.08)' }}
          >
            {COMMANDS.map((cmd, i) => {
              const Icon = cmd.icon;
              const isActive = active === i;
              const isFired = firedId === cmd.id;

              return (
                <div
                  key={cmd.id}
                  className={`ag-quantum-lift${isFired ? ' fired' : ''} relative cursor-pointer`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => fireAndNavigate(cmd)}
                >
                  {/* Liquid active pill — uses layoutId for zero-gravity transition */}
                  {isActive && (
                    <motion.div
                      layoutId="ag-active-pill"
                      className="absolute inset-x-2 inset-y-1 rounded-sm"
                      initial={false}
                      style={{
                        background: `linear-gradient(90deg, ${cmd.accentColor}18, ${cmd.accentColor}08)`,
                        borderLeft: `2px solid ${cmd.accentColor}`,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                    />
                  )}

                  <div className="relative flex items-center gap-4 px-5 py-3.5">
                    {/* Icon */}
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: isActive ? `${cmd.accentColor}20` : 'transparent',
                        color: isActive ? cmd.accentColor : 'var(--text-2)',
                        boxShadow: isActive ? `0 0 12px ${cmd.accentColor}40` : 'none',
                      }}
                    >
                      <Icon size={15} />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col min-w-0">
                      <span
                        className="font-subheading text-sm uppercase tracking-wider transition-colors duration-200 truncate"
                        style={{
                          color: isActive ? 'var(--text-0)' : 'var(--text-1)',
                          textShadow: isActive ? `0 0 8px ${cmd.accentColor}80` : 'none',
                        }}
                      >
                        {cmd.label}
                      </span>
                      <span
                        className="font-mono text-[10px] truncate mt-0.5"
                        style={{ color: 'var(--text-2)' }}
                      >
                        {cmd.sub}
                      </span>
                    </div>

                    {/* Arrow indicator */}
                    <motion.div
                      className="ml-auto flex-shrink-0"
                      animate={{ x: isActive ? 0 : -4, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight size={12} style={{ color: cmd.accentColor }} />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Preview panel */}
          <div className="flex-1 relative overflow-hidden">
            <PreviewPanel command={COMMANDS[active]} />
          </div>
        </div>

        {/* Footer status bar */}
        <div
          className="flex items-center gap-4 px-5 py-2 border-t"
          style={{ borderColor: 'rgba(255,0,127,0.12)' }}
        >
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--text-2)' }}
          >
            ANTIGRAVITY_LAUNCHER v1.0
          </span>
          <span className="flex-1" />
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: 'var(--neon-cyan)', boxShadow: '0 0 6px var(--neon-cyan)' }}
          />
          <span className="font-mono text-[10px]" style={{ color: 'var(--text-2)' }}>
            SYSTEM ONLINE
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Root export ─────────────────────────────────────────────────────────────
const CommandLauncher = () => {
  const [open, setOpen] = useState(false);

  // Global hotkey: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((p) => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <FAB onClick={() => setOpen(true)} />
      <AnimatePresence>
        {open && <LauncherModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default CommandLauncher;
