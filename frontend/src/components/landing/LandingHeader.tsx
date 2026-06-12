import React from 'react';

interface LandingHeaderProps {
  onLogin: () => void;
  onTrySandbox: () => void;
}

export default function LandingHeader({ onLogin, onTrySandbox }: LandingHeaderProps) {
  return (
    <header className="max-w-7xl mx-auto w-full px-6 py-5 flex justify-between items-center z-30 relative border-b border-zinc-200/50 backdrop-blur-md bg-white/60 sticky top-0">
      <div className="flex items-center gap-2.5">
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 shrink-0 select-none">
          <defs>
            <linearGradient id="header-spark-grad-comp" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6D5EF9" />
              <stop offset="25%" stopColor="#A855F7" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="75%" stopColor="#FF6B6B" />
              <stop offset="100%" stopColor="#14B8A6" />
            </linearGradient>
          </defs>
          <path d="M12 2C12 2 12.5 8.5 19 9C12.5 9.5 12 16 12 16C12 16 11.5 9.5 5 9C11.5 8.5 12 2 12 2Z" fill="url(#header-spark-grad-comp)" />
          <path d="M12 12C12 12 12.25 15.25 15.5 15.5C12.25 15.75 12 19 12 19C12 19 11.75 15.75 8.5 15.5C11.75 15.25 12 12 12 12Z" fill="url(#header-spark-grad-comp)" opacity="0.8" />
          <path d="M18 4C18 4 18.15 5.95 20.1 6.1C18.15 6.25 18 8.2 18 8.2C18 8.2 17.85 6.25 15.9 6.1C17.85 5.95 18 4 18 4Z" fill="url(#header-spark-grad-comp)" opacity="0.9" />
        </svg>
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
