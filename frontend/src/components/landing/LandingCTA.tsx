import React from 'react';

interface LandingCTAProps {
  onLogin: () => void;
  onTrySandbox: () => void;
}

export default function LandingCTA({ onLogin, onTrySandbox }: LandingCTAProps) {
  return (
    <section className="py-20 bg-white border-t border-zinc-200/60 z-10 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-brand-gradient rounded-[40px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white"></div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 relative z-10 font-display tracking-tight leading-tight">
            Ready to flow your insights into action?
          </h2>
          <p className="text-sm md:text-base mb-10 max-w-xl mx-auto opacity-90 relative z-10 leading-relaxed font-semibold">
            Join 10,000+ teams building the future of data collection and workflow automation with Foryo Formix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10 max-w-md mx-auto">
            <button 
              onClick={onLogin}
              className="h-14 px-8 bg-white text-[#6D5EF9] hover:text-[#A855F7] rounded-2xl font-extrabold text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 cursor-pointer"
            >
              Get Started for Free
            </button>
            <button 
              onClick={onTrySandbox}
              className="h-14 px-8 border-2 border-white/30 text-white hover:bg-white/10 rounded-2xl font-extrabold text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Try Sandbox Simulator
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
