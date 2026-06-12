import React from 'react';

export default function LandingPositioning() {
  return (
    <section id="operations" className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-zinc-200/60 relative z-10 text-left">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-16">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-[#EC4899] uppercase tracking-wider font-display">Product Positioning</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight font-display">
            Not a simple form builder. An Operations Platform.
          </h2>
        </div>
        <p className="text-sm text-zinc-500 lg:max-w-md leading-relaxed">
          Formix rejects the limitations of traditional drag-and-drop clones. It is built for teams who manage forms as operational workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Block: What Foryo Formix IS NOT */}
        <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-md flex flex-col gap-6">
          <div className="text-xs font-bold text-[#FF6B6B] uppercase tracking-widest font-display">What Foryo Formix is NOT</div>
          
          <div className="flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="w-5 h-5 rounded-full bg-[#FF6B6B]/10 text-red-600 flex items-center justify-center shrink-0 font-extrabold text-xs">✕</div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800">Just Another Form Builder</h4>
                <p className="text-xs text-zinc-500 mt-1">We don't just dump raw input fields into static templates. We focus on connected workflows, analytics data extraction, and Google drive control.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-5 h-5 rounded-full bg-[#FF6B6B]/10 text-red-600 flex items-center justify-center shrink-0 font-extrabold text-xs">✕</div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800">Just a Google Forms Clone</h4>
                <p className="text-xs text-zinc-500 mt-1">We synchronize with the Google API but construct local-first sandboxes, rich layouts, draggable accordion layers, and excel importers before pushing live.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-5 h-5 rounded-full bg-[#FF6B6B]/10 text-red-600 flex items-center justify-center shrink-0 font-extrabold text-xs">✕</div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800">An AI-First Gimmick</h4>
                <p className="text-xs text-zinc-500 mt-1">AI shouldn't build broken layouts. We use structured schema rules, robust Postgres syncing, Prisma validation, and strict API exports to assure stability.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Block: What Foryo Formix IS */}
        <div className="p-8 rounded-3xl border border-[#14B8A6]/15 bg-[#14B8A6]/3 shadow-md flex flex-col gap-6 relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#14B8A6]/10 rounded-full blur-2xl"></div>
          
          <div className="text-xs font-bold text-[#14B8A6] uppercase tracking-widest font-display">What Foryo Formix IS</div>
          
          <div className="flex flex-col gap-5">
            <div className="flex gap-4">
              <div className="w-5 h-5 rounded-full bg-[#14B8A6]/15 text-[#0d9488] flex items-center justify-center shrink-0 font-extrabold text-xs">✓</div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800">Spreadsheet Configuration Engine</h4>
                <p className="text-xs text-zinc-500 mt-1">Upload an Excel or CSV file. Automatically isolate questions, options, point allocations, and answer keys, rendering a clean platform edit preview immediately.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-5 h-5 rounded-full bg-[#14B8A6]/15 text-[#0d9488] flex items-center justify-center shrink-0 font-extrabold text-xs">✓</div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800">Granular Quiz Operations Controller</h4>
                <p className="text-xs text-zinc-500 mt-1">Toggle Quiz Mode globally, define points per card, select correct answers, and apply bulk required/optional updates dynamically in a single click.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-5 h-5 rounded-full bg-[#14B8A6]/15 text-[#0d9488] flex items-center justify-center shrink-0 font-extrabold text-xs">✓</div>
              <div>
                <h4 className="text-sm font-bold text-zinc-800">Multi-Theme Adaptation Layouts</h4>
                <p className="text-xs text-zinc-500 mt-1">Alter components geometry across Glassmorphism, Neo-Brutalism, and Minimalist structures using unified CSS variables rather than hardcoding components.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
