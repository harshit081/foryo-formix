import React from 'react';

export default function LandingFooter() {
  return (
    <footer className="max-w-7xl mx-auto w-full px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6 z-10 relative border-t border-zinc-200/50 bg-white text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
          <path d="M12 2C12 2 12.5 8.5 19 9C12.5 9.5 12 16 12 16C12 16 11.5 9.5 5 9C11.5 8.5 12 2 12 2Z" fill="#6D5EF9" />
        </svg>
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
