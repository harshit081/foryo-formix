import React from 'react';

export default function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-white border-t border-zinc-200/60 z-10 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-[#EC4899] uppercase tracking-wider font-display bg-[#EC4899]/5 px-3 py-1.5 rounded-full">Features</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-4 font-display">The Command Center for your Forms</h2>
          <p className="text-sm text-zinc-500 mt-3 max-w-xl mx-auto">Everything you need to orchestrate data, responses, and teams in a single, fluid interface.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Create */}
          <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#6D5EF9]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#6D5EF9]/10 px-2.5 py-1 rounded-full border border-[#6D5EF9]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D5EF9] animate-pulse"></span>
              <span className="text-[9px] text-[#6D5EF9] font-black uppercase tracking-wider">Demo Animation</span>
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#6D5EF9]/10 flex items-center justify-center text-[#6D5EF9] mb-6 transition-all duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl">add_circle</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-display">Create</h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Build forms faster with our intuitive drag-and-drop node interface.</p>
            </div>
            <div className="demo-node-builder h-12 flex items-center justify-center gap-4 border-t border-zinc-200/50 pt-4 mt-6">
              <div className="node w-3 h-3 rounded-full bg-[#6D5EF9]"></div>
              <div className="h-[1.5px] w-8 bg-[#6D5EF9]/30"></div>
              <div className="node w-3 h-3 rounded-full bg-[#6D5EF9]" style={{ animationDelay: '0.5s' }}></div>
              <div className="h-[1.5px] w-8 bg-[#6D5EF9]/30"></div>
              <div className="node w-3 h-3 rounded-full bg-[#6D5EF9]" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Excel to Form */}
          <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#A855F7]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#A855F7]/10 px-2.5 py-1 rounded-full border border-[#A855F7]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse"></span>
              <span className="text-[9px] text-[#A855F7] font-black uppercase tracking-wider">Active Engine</span>
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#A855F7]/10 flex items-center justify-center text-[#A855F7] mb-6 transition-all duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl">table_view</span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 font-display">Excel to Form</h3>
              </div>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Instantaneously convert complex spreadsheets into smart, interactive forms.</p>
            </div>
            <div className="h-12 flex items-center justify-center border-t border-zinc-200/50 pt-4 mt-6">
              <span className="material-symbols-outlined text-[#A855F7] text-2xl sync-icon animate-pulse">sync</span>
            </div>
          </div>

          {/* Google Forms Sync */}
          <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#14B8A6]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#14B8A6]/10 px-2.5 py-1 rounded-full border border-[#14B8A6]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></span>
              <span className="text-[9px] text-[#14B8A6] font-black uppercase tracking-wider">Synced Live</span>
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] mb-6 transition-all duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl">sync_alt</span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 font-display">Google Sync</h3>
              </div>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Mirror data bi-directionally with Google Forms for legacy compatibility.</p>
            </div>
            <div className="h-12 flex items-center justify-center border-t border-zinc-200/50 pt-4 mt-6">
              <span className="material-symbols-outlined text-[#14B8A6] text-2xl sync-icon">sync</span>
            </div>
          </div>

          {/* Manage */}
          <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#EC4899]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#EC4899]/10 px-2.5 py-1 rounded-full border border-[#EC4899]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] animate-pulse"></span>
              <span className="text-[9px] text-[#EC4899] font-black uppercase tracking-wider">Demo Animation</span>
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EC4899]/10 flex items-center justify-center text-[#EC4899] mb-6 transition-all duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl">folder_managed</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-display">Manage</h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Organize responses centrally with high-fidelity status cards.</p>
            </div>
            <div className="demo-cards h-12 flex items-center justify-center gap-3 border-t border-zinc-200/50 pt-4 mt-6 overflow-hidden">
              <div className="card-slide w-8 h-10 bg-[#EC4899]/10 rounded border border-[#EC4899]/20"></div>
              <div className="card-slide w-8 h-10 bg-[#EC4899]/10 rounded border border-[#EC4899]/20" style={{ animationDelay: '0.4s' }}></div>
              <div className="card-slide w-8 h-10 bg-[#EC4899]/10 rounded border border-[#EC4899]/20" style={{ animationDelay: '0.8s' }}></div>
            </div>
          </div>

          {/* Analyze */}
          <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#FF6B6B]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#FF6B6B]/10 px-2.5 py-1 rounded-full border border-[#FF6B6B]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse"></span>
              <span className="text-[9px] text-[#FF6B6B] font-black uppercase tracking-wider">Demo Animation</span>
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FF6B6B]/10 flex items-center justify-center text-[#FF6B6B] mb-6 transition-all duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl">bar_chart_4_bars</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-display">Analyze</h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Understand performance with automated trends and insight reports.</p>
            </div>
            <div className="demo-growth h-12 flex flex-col justify-center gap-2.5 border-t border-zinc-200/50 pt-4 mt-6">
              <div className="bar h-2 bg-[#FF6B6B]/40 rounded-full"></div>
              <div className="bar h-2 bg-[#FF6B6B]/40 rounded-full" style={{ animationDelay: '0.5s', opacity: 0.6 }}></div>
            </div>
          </div>

          {/* Automate */}
          <div className="bg-[#F7F8FA] p-8 rounded-3xl border border-zinc-200/80 hover:bg-white hover:border-[#14B8A6]/40 hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[290px] text-left">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#14B8A6]/10 px-2.5 py-1 rounded-full border border-[#14B8A6]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse"></span>
              <span className="text-[9px] text-[#14B8A6] font-black uppercase tracking-wider">Demo Animation</span>
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] mb-6 transition-all duration-300 group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl">auto_mode</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 font-display">Automate</h3>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Trigger workflows across your stack based on custom logic.</p>
            </div>
            <div className="demo-automate h-12 flex items-center justify-center gap-4 border-t border-zinc-200/50 pt-4 mt-6">
              <div className="w-10 h-5 bg-slate-200 rounded-full p-0.5 flex items-center">
                <div className="toggle w-4 h-4 bg-white rounded-full shadow-sm animate-toggleSwitch"></div>
              </div>
              <span className="material-symbols-outlined text-[#14B8A6] scale-110">check_circle</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
