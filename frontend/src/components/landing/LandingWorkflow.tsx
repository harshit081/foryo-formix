import React from 'react';

export default function LandingWorkflow() {
  return (
    <section className="py-24 bg-[#F7F8FA] overflow-hidden border-t border-zinc-200/50 z-10 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-xl mx-auto flex flex-col gap-3">
          <span className="text-xs font-bold text-[#6D5EF9] uppercase tracking-wider font-display bg-[#6D5EF9]/5 px-3 py-1.5 rounded-full self-center">Lifecycle</span>
          <h2 className="text-3xl font-extrabold text-[#111827] mt-1 font-display">Seamless Response Flow</h2>
          <p className="text-xs text-zinc-500">How Formix routes information dynamically across your platforms</p>
        </div>

        <div className="relative max-w-5xl mx-auto px-8 py-4">
          {/* Pulsing Glow Path Line */}
          <div className="absolute top-12 left-0 w-full h-1.5 pointer-events-none opacity-80 hidden md:block">
            <svg height="6" preserveAspectRatio="none" viewBox="0 0 1000 6" width="100%">
              <path className="glowing-flow-line" d="M0 3H1000" stroke="url(#flowGradient)" strokeLinecap="round" strokeWidth="5"></path>
              <defs>
                <linearGradient id="flowGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#6D5EF9"></stop>
                  <stop offset="25%" stopColor="#A855F7"></stop>
                  <stop offset="50%" stopColor="#EC4899"></stop>
                  <stop offset="75%" stopColor="#FF6B6B"></stop>
                  <stop offset="100%" stopColor="#14B8A6"></stop>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[#6D5EF9] shadow-md group-hover:bg-[#6D5EF9] group-hover:text-white transition-all duration-350 hover:scale-105">
                <span className="material-symbols-outlined text-2xl font-semibold">description</span>
              </div>
              <span className="text-xs font-bold text-zinc-700">Form Created</span>
            </div>
            <div className="hidden md:block flex-1 border-t border-dashed border-zinc-300"></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[#A855F7] shadow-md group-hover:bg-[#A855F7] group-hover:text-white transition-all duration-350 hover:scale-105">
                <span className="material-symbols-outlined text-2xl font-semibold">send</span>
              </div>
              <span className="text-xs font-bold text-zinc-700">Submission</span>
            </div>
            <div className="hidden md:block flex-1 border-t border-dashed border-zinc-300"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[#EC4899] shadow-md group-hover:bg-[#EC4899] group-hover:text-white transition-all duration-350 hover:scale-105">
                <span className="material-symbols-outlined text-2xl font-semibold">rate_review</span>
              </div>
              <span className="text-xs font-bold text-zinc-700">Review</span>
            </div>
            <div className="hidden md:block flex-1 border-t border-dashed border-zinc-300"></div>

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[#FF6B6B] shadow-md group-hover:bg-[#FF6B6B] group-hover:text-white transition-all duration-350 hover:scale-105">
                <span className="material-symbols-outlined text-2xl font-semibold">assignment_ind</span>
              </div>
              <span className="text-xs font-bold text-zinc-700">Assignment</span>
            </div>
            <div className="hidden md:block flex-1 border-t border-dashed border-zinc-300"></div>

            {/* Step 5 */}
            <div className="flex flex-col items-center gap-4 group">
              <div className="w-16 h-16 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-[#14B8A6] shadow-md group-hover:bg-[#14B8A6] group-hover:text-white transition-all duration-350 hover:scale-105">
                <span className="material-symbols-outlined text-2xl font-semibold">check_circle</span>
              </div>
              <span className="text-xs font-bold text-zinc-700">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
