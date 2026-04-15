// src/components/ui/Ticker.jsx
import React from 'react';

const Ticker = () => {
  // Repeated content to ensure seamless scrolling
  const TickerContent = () => (
    <div className="flex shrink-0 items-center whitespace-nowrap">
      <span className="mx-4">CLUTCHRIT</span>
      <span className="mx-2 opacity-50">·</span>
      <span className="mx-4">RAMAIAH INSTITUTE OF TECHNOLOGY</span>
      <span className="mx-2 opacity-50">·</span>
      <span className="mx-4">GAMING CLUB</span>
      <span className="mx-2 opacity-50">·</span>
      <span className="mx-4">EST. 2025</span>
      <span className="mx-2 opacity-50">·</span>
      <span className="mx-4">VALORANT</span>
      <span className="mx-2 opacity-50">·</span>
      <span className="mx-4">BGMI</span>
      <span className="mx-2 opacity-50">·</span>
      <span className="mx-4">MINECRAFT</span>
      <span className="mx-2 opacity-50">·</span>
      <span className="mx-4">FREE FIRE</span>
      <span className="mx-2 opacity-50">·</span>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 w-full h-8 bg-acid text-void font-subheading uppercase tracking-wider text-sm flex items-center overflow-hidden z-[9999] border-b border-void/20">
      <div className="flex animate-marquee min-w-full">
        {/* Render multiple instances for continuous scrolling effect */}
        <TickerContent />
        <TickerContent />
        <TickerContent />
        <TickerContent />
      </div>
    </div>
  );
};

export default Ticker;
