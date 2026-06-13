import React from 'react';

export default function LandingFooter() {
  return (
    <footer className="max-w-7xl mx-auto w-full px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6 z-10 relative border-t border-zinc-200/50 bg-white text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Foryo Formix Logo" className="w-5 h-5 shrink-0 select-none object-contain" />
        <span>&copy; {new Date().getFullYear()} Foryo Formix. Flowing insights into action.</span>
      </div>
      <div className="flex gap-6">
        <span className="hover:text-[#111827] cursor-pointer transition-colors">Privacy Policy</span>
        <span className="hover:text-[#111827] cursor-pointer transition-colors">Terms of Service</span>
        <span className="hover:text-[#111827] cursor-pointer transition-colors">Status</span>
        <span className="hover:text-[#111827] cursor-pointer transition-colors">Security</span>
      </div>
    </footer>
  );
}
