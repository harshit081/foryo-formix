import React from 'react';

interface LandingThemeShowcaseProps {
  showcaseTheme: string;
  setShowcaseTheme: (theme: string) => void;
}

export default function LandingThemeShowcase({
  showcaseTheme,
  setShowcaseTheme
}: LandingThemeShowcaseProps) {
  return (
    <section id="showcase" className="max-w-7xl mx-auto w-full px-6 py-20 border-t border-zinc-200/60 relative z-10 text-left">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4 mb-14">
        <span className="text-xs font-bold text-[#6D5EF9] uppercase tracking-wider font-display">Geometry Adaptive Design</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight font-display">
          The Dynamic Theme Adaptor
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Foryo Formix decouples component logic from aesthetics. Toggle the base geometry selectors below to see how borders, shadow offsets, typography, and card panels transform instantly.
        </p>
      </div>

      {/* Interactive Widget Container */}
      <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 relative">
        
        {/* Control Panel (Left Side of widget) */}
        <div className="flex flex-col gap-5 w-full md:w-[220px] shrink-0 text-left">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Select Style Theme</span>
            <div className="flex flex-col gap-1.5">
              {[
                { id: 'glass', name: 'Glassmorphism' },
                { id: 'neo-brutalism', name: 'Neo-Brutalism' },
                { id: 'minimalist', name: 'Minimalist' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setShowcaseTheme(t.id)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg border text-left transition-all cursor-pointer ${showcaseTheme === t.id ? 'bg-[#6D5EF9]/10 text-[#6D5EF9] border-[#6D5EF9]/30' : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-800'}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-[10px] text-zinc-400 leading-normal bg-zinc-50 p-3 rounded-lg border border-zinc-100 italic font-medium">
            Observe the corner radius, shadow offsets, and outlines as you switch layout styles.
          </div>
        </div>

        {/* Showcase Output Box (Right Side of widget - Always Light Mode) */}
        <div 
          className="flex-1 w-full p-6 rounded-2xl border border-zinc-200 bg-[#F7F8FA] flex flex-col justify-center items-center min-h-[260px] transition-all duration-300"
          style={{
            backgroundColor: showcaseTheme === 'neo-brutalism' ? '#FAFAFA' : '#F7F8FA',
            fontFamily: showcaseTheme === 'neo-brutalism' ? 'Courier New, monospace' : 'Inter, sans-serif'
          }}
        >
          <div 
            className="w-full max-w-[340px] p-5 theme-card text-left transition-all duration-300 bg-white"
            style={{
              border: showcaseTheme === 'neo-brutalism' ? '3px solid #111827' : '1px solid rgba(0,0,0,0.06)',
              borderRadius: showcaseTheme === 'glass' ? '16px' : (showcaseTheme === 'minimalist' ? '6px' : '0px'),
              boxShadow: showcaseTheme === 'neo-brutalism' 
                ? '6px 6px 0px 0px #111827'
                : (showcaseTheme === 'glass' ? '0 8px 30px rgba(0,0,0,0.04)' : '0 1px 3px rgba(0,0,0,0.05)'),
              backdropFilter: showcaseTheme === 'glass' ? 'blur(12px)' : 'none',
              color: '#111827'
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <span 
                className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5"
                style={{
                  backgroundColor: showcaseTheme === 'neo-brutalism' ? 'transparent' : 'rgba(109, 94, 249, 0.08)',
                  color: '#6D5EF9',
                  border: showcaseTheme === 'neo-brutalism' ? '1.5px solid #111827' : 'none',
                  borderRadius: showcaseTheme === 'glass' ? '6px' : (showcaseTheme === 'minimalist' ? '2px' : '0px')
                }}
              >
                Layout Element
              </span>
              <span className="text-[10px] opacity-40 font-bold">Section 2</span>
            </div>

            <h4 className="text-xs font-bold leading-tight mb-2">
              Adaptable components change shapes, shadows and borders
            </h4>
            
            <p className="text-[10px] opacity-60 leading-normal mb-4 font-semibold">
              Using responsive CSS custom properties mapped to design-system layouts.
            </p>

            <button 
              className="w-full py-2 text-xs font-bold transition-all text-center"
              style={{
                backgroundColor: '#6D5EF9',
                color: '#ffffff',
                border: showcaseTheme === 'neo-brutalism' ? '2px solid #111827' : 'none',
                borderRadius: showcaseTheme === 'glass' ? '10px' : (showcaseTheme === 'minimalist' ? '4px' : '0px'),
                boxShadow: showcaseTheme === 'neo-brutalism' 
                  ? '3px 3px 0px 0px #111827'
                  : 'none'
              }}
            >
              Confirm Style Update
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
