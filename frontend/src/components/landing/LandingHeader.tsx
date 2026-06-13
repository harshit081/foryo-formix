import React from 'react';

interface LandingHeaderProps {
  onLogin: () => void;
  onTrySandbox: () => void;
}

export default function LandingHeader({ onLogin, onTrySandbox }: LandingHeaderProps) {
  return (
    <header className="max-w-7xl mx-auto w-full px-6 py-5 flex justify-between items-center z-30 relative border-b border-zinc-200/50 backdrop-blur-md bg-white/60 sticky top-0">
      <div className="flex items-center gap-2.5">
        <img src="/logo.png" alt="Foryo Formix Logo" className="w-8 h-8 shrink-0 select-none object-contain" />
        <div className="flex flex-col items-start leading-none text-left">
          <span className="text-[9px] font-bold text-[#A855F7] tracking-wider uppercase font-display select-none">Foryo</span>
          <span className="text-base font-extrabold font-display tracking-tight text-[#111827]">
            Formix
          </span>
        </div>
      </div>
      
      <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-zinc-500">
        <a href="#editor" className="hover:text-zinc-900 transition-colors">Visual Editor</a>
        <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
        <a href="#pillars" className="hover:text-zinc-900 transition-colors">Ecosystem Pillars</a>
        <a href="#operations" className="hover:text-zinc-900 transition-colors">Form Operations</a>
        <a href="#showcase" className="hover:text-zinc-900 transition-colors">Layout Engine</a>
      </nav>

      <div className="flex items-center gap-4">
        <button 
          onClick={onTrySandbox}
          className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer hidden sm:inline-block"
        >
          Quick Demo
        </button>
        <button 
          onClick={onLogin}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#6D5EF9] to-[#EC4899] hover:from-[#A855F7] hover:to-[#FF6B6B] rounded-xl transition-all duration-300 cursor-pointer shadow-md shadow-[#6D5EF9]/15 hover:shadow-[#A855F7]/25"
        >
          Sign In
        </button>
      </div>
    </header>
  );
}
