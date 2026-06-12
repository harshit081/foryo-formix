import React from 'react';

interface Bubble {
  id: number;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

interface LandingTickerProps {
  bubbles: Bubble[];
}

export default function LandingTicker({ bubbles }: LandingTickerProps) {
  return (
    <div className="bg-white/60 backdrop-blur-sm border-y border-zinc-200/80 py-6 relative overflow-hidden z-20">
      {/* Bubble container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bubbles.map(b => (
          <div
            key={b.id}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: b.delay,
              '--duration': b.duration
            } as any}
          />
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-6 overflow-hidden flex items-center gap-12 whitespace-nowrap relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Live Activity:</span>
        </div>
        <div className="flex items-center gap-16 animate-marquee">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#6D5EF9]">48,291</span>
            <span className="text-xs text-zinc-500 font-medium">Forms Completed Today</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#EC4899]">+12.4%</span>
            <span className="text-xs text-zinc-500 font-medium">Response Rate</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#14B8A6]">1,204</span>
            <span className="text-xs text-zinc-500 font-medium">Workflows Triggered</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#6D5EF9]">850ms</span>
            <span className="text-xs text-zinc-500 font-medium">Avg Sync Speed</span>
          </div>
          
          {/* Duplicate for continuity */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#6D5EF9]">48,291</span>
            <span className="text-xs text-zinc-500 font-medium">Forms Completed Today</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#EC4899]">+12.4%</span>
            <span className="text-xs text-zinc-500 font-medium">Response Rate</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#14B8A6]">1,204</span>
            <span className="text-xs text-zinc-500 font-medium">Workflows Triggered</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#6D5EF9]">850ms</span>
            <span className="text-xs text-zinc-500 font-medium">Avg Sync Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
