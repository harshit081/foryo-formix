import React from 'react';

interface LandingHeroProps {
  onLogin: () => void;
  onTrySandbox: () => void;
}

export default function LandingHero({ onLogin, onTrySandbox }: LandingHeroProps) {
  return (
    <section className="max-w-7xl mx-auto w-full px-6 pt-0 pb-0 z-10 relative flex flex-col lg:flex-row items-center justify-center gap-14 min-h-[calc(100vh-140px)]">
      {/* Left Hero Pitch */}
      <div className="flex-1 flex flex-col items-start text-left gap-6 lg:max-w-xl animate-fade-in-up z-10 relative pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#6D5EF9]/20 bg-[#6D5EF9]/5 text-xs text-[#6D5EF9] font-bold select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6D5EF9] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6D5EF9]"></span>
          </span>
          <span>Foryo Ecosystem First Product</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.08] tracking-tight text-[#111827]">
          Forms that do more than <span className="gradient-text bg-gradient-to-r from-[#6D5EF9] via-[#A855F7] to-[#EC4899] to-[#14B8A6] bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradientShift_6s_linear_infinite]">collect.</span>
        </h1>
        
        <p className="text-base text-zinc-600 leading-relaxed">
          Create forms, manage responses, track trends, and turn submissions into actions. The command center for high-performing teams. Design quizzes, parse spreadsheets, apply responsive layout design engines, and sync directly with Google Forms.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 z-20">
          <button 
            onClick={onLogin}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#6D5EF9] via-[#A855F7] to-[#EC4899] hover:from-[#A855F7] hover:to-[#FF6B6B] text-white text-sm font-bold flex items-center justify-center gap-2.5 cursor-pointer shadow-lg shadow-[#6D5EF9]/20 hover:shadow-[#A855F7]/30 transition-all duration-300 hover:scale-[1.02]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Connect Google Drive</span>
          </button>
          
          <button 
            onClick={onTrySandbox}
            className="px-7 py-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all duration-200"
          >
            <span>Try Sandbox Locally</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2">
          <span className="flex items-center gap-1.5">✦ Local-First Sandbox</span>
          <span className="text-zinc-200">|</span>
          <span className="flex items-center gap-1.5">✦ Excel Spreadsheet Parser</span>
          <span className="text-zinc-200">|</span>
          <span className="flex items-center gap-1.5">✦ Responsive CSS Themes</span>
        </div>
      </div>

      {/* Right Column: ThreeJS Container, bleeding outwards but centered on its column */}
      <div className="flex-1 w-full flex items-center justify-center relative mt-8 lg:mt-0 z-20 lg:self-stretch">
        <div className="absolute w-[130vw] md:w-[110vw] lg:w-[125vw] h-full flex items-center justify-center pointer-events-none">
          <div className="absolute w-[350px] h-[350px] rounded-full bg-[#6D5EF9]/6 blur-3xl pointer-events-none animate-pulse"></div>
          <div id="threejs-container" className="w-full h-full"></div>
        </div>
      </div>
    </section>
  );
}
