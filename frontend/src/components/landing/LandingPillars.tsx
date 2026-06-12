import React from 'react';

export default function LandingPillars() {
  return (
    <section id="pillars" className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-zinc-200/60 relative z-10">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4 mb-16">
        <span className="text-xs font-bold text-[#6D5EF9] uppercase tracking-wider font-display">Foryo Ecosystem Vision</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight leading-none font-display">
          Foryo Spark Logo Representation
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Foryo helps people collect, manage, understand, and act on information. The colorful spark logo reflects the four pillars of this connected workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Pillar 1: Insight */}
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#6D5EF9]/40 hover:shadow-xl hover:shadow-[#6D5EF9]/5 transition-all group hover:scale-[1.02] flex flex-col gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#6D5EF9]/10 flex items-center justify-center text-[#6D5EF9]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#111827] font-display">✦ Insight</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Understand response data dynamically. Formix maps correct answers, grades responses in real-time, and calculates aggregate statistical summaries with bar charts.
          </p>
        </div>

        {/* Pillar 2: Discovery */}
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#EC4899]/40 hover:shadow-xl hover:shadow-[#EC4899]/5 transition-all group hover:scale-[1.02] flex flex-col gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#EC4899]/10 flex items-center justify-center text-[#EC4899]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#111827] font-display">✦ Discovery</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Uncover form layouts inside sheets. Ingest raw spreadsheets (Excel/CSV) containing question titles, option grids, points, and keys to create forms in a single click.
          </p>
        </div>

        {/* Pillar 3: Completion */}
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#FF6B6B]/40 hover:shadow-xl hover:shadow-[#FF6B6B]/5 transition-all group hover:scale-[1.02] flex flex-col gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B6B]/10 flex items-center justify-center text-[#FF6B6B]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#111827] font-display">✦ Completion</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Publish workflows securely. Synchronize local forms with Google Forms API. Instantly build questions, choices, page structures, and quiz configurations on the cloud.
          </p>
        </div>

        {/* Pillar 4: Connected Workflows */}
        <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:border-[#14B8A6]/40 hover:shadow-xl hover:shadow-[#14B8A6]/5 transition-all group hover:scale-[1.02] flex flex-col gap-4 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#111827] font-display">✦ Connected Workflows</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Act on information immediately. Connect Drive OAuth structures, implement dual platform/Drive deletions, and link form submissions to active workspace destinations.
          </p>
        </div>
      </div>
    </section>
  );
}
