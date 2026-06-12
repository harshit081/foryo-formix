import React from 'react';

interface DemoQuestion {
  title: string;
  type: string;
  choices: string[];
  points: number;
  required: boolean;
  correctIdx: number;
}

interface LandingEditorProps {
  demoQuestion: DemoQuestion;
  setDemoQuestion: React.Dispatch<React.SetStateAction<DemoQuestion>>;
  isAutoplayPaused: boolean;
  cursorPos: { x: string; y: string; visible: boolean };
  onInteract: () => void;
}

export default function LandingEditor({
  demoQuestion,
  setDemoQuestion,
  isAutoplayPaused,
  cursorPos,
  onInteract
}: LandingEditorProps) {
  return (
    <section id="editor" className="max-w-7xl mx-auto w-full px-6 py-24 z-10 relative border-t border-zinc-200/50 bg-[#F7F8FA]">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4 mb-16">
        <span className="text-xs font-bold text-[#6D5EF9] uppercase tracking-wider font-display">Interactive Canvas</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight leading-none font-display">
          Design Forms, See Previews Instantly
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          Watch the simulator design a form, or click inside the editor card to take control and customize the fields yourself. Your modifications sync directly to the mobile preview.
        </p>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch justify-center relative max-w-5xl mx-auto">
        {/* Ambient Background Glow behind widget */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#6D5EF9]/5 to-[#14B8A6]/5 rounded-3xl blur-2xl opacity-60 pointer-events-none"></div>

        {/* Left Column: Mini Editor Card */}
        <div 
          className="flex-1 p-6 rounded-3xl border border-zinc-200 bg-white shadow-xl flex flex-col gap-5 text-left relative overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-default"
          onClick={onInteract}
        >
          {/* Autoplay simulator cursor pointer (Figma-style) */}
          {cursorPos.visible && (
            <div 
              className="absolute pointer-events-none z-[99] flex items-center gap-1"
              style={{ 
                left: cursorPos.x, 
                top: cursorPos.y,
                transition: 'left 1.2s cubic-bezier(0.16, 1, 0.3, 1), top 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <svg className="w-5.5 h-5.5 text-[#6D5EF9] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 3v15.2l4.2-4.2 3.1 7.2 2.6-1.1-3.1-7.2 5.5-.2L4.5 3z" stroke="white" strokeWidth="1.5" strokeLinejoin="miter" />
              </svg>
              <div className="bg-[#6D5EF9] text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-md select-none transform translate-y-3 -translate-x-1 uppercase tracking-wider scale-90">
                Formix Agent
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#A855F7] tracking-wider uppercase">Platform Editor</span>
              <span className="text-[11px] text-zinc-400 font-medium mt-0.5">Interactive Operations Canvas</span>
            </div>
            {isAutoplayPaused ? (
              <span className="text-[10px] text-zinc-500 font-bold bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                Interactive Mode
              </span>
            ) : (
              <span className="text-[10px] text-[#6D5EF9] font-bold bg-[#6D5EF9]/10 border border-[#6D5EF9]/20 px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6D5EF9] animate-ping"></span>
                Simulating Autoplay
              </span>
            )}
          </div>

          {/* Title input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Question Title</label>
            <input 
              type="text" 
              value={demoQuestion.title}
              onChange={(e) => setDemoQuestion(prev => ({ ...prev, title: e.target.value }))}
              className="px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:border-[#6D5EF9] focus:bg-white transition-all font-semibold shadow-sm focus:ring-2 focus:ring-[#6D5EF9]/10"
              placeholder="Type a question..."
            />
          </div>

          {/* Type Select */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Question Type</label>
            <select 
              value={demoQuestion.type}
              onChange={(e) => setDemoQuestion(prev => ({ ...prev, type: e.target.value }))}
              className="px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 outline-none focus:border-[#6D5EF9] focus:bg-white transition-all cursor-pointer font-semibold shadow-sm"
            >
              <option value="MULTIPLE_CHOICE" className="bg-white">Multiple Choice</option>
              <option value="CHECKBOX" className="bg-white">Checkboxes</option>
              <option value="TEXT" className="bg-white">Short Text</option>
            </select>
          </div>

          {/* Choices builder (only shown for MULTIPLE_CHOICE/CHECKBOX) */}
          {demoQuestion.type !== 'TEXT' && (
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Answer Options & Correct Key</label>
              <div className="flex flex-col gap-2.5 max-h-[140px] overflow-y-auto pr-1">
                {demoQuestion.choices.map((choice, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <input 
                      type="radio"
                      name="demo-correct"
                      checked={demoQuestion.correctIdx === idx}
                      onChange={() => setDemoQuestion(prev => ({ ...prev, correctIdx: idx }))}
                      className="w-4 h-4 text-[#14B8A6] border-zinc-300 focus:ring-[#14B8A6] cursor-pointer"
                      title="Mark as correct"
                    />
                    <input 
                      type="text"
                      value={choice}
                      onChange={(e) => {
                        const newChoices = [...demoQuestion.choices];
                        newChoices[idx] = e.target.value;
                        setDemoQuestion(prev => ({ ...prev, choices: newChoices }));
                      }}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800 outline-none focus:border-[#6D5EF9] focus:bg-white transition-all font-medium shadow-sm"
                    />
                  </div>
                ))}
              </div>
              <span className="text-[9px] text-zinc-400 font-medium italic mt-0.5">Tip: Click the radio button to designate the correct answer key.</span>
            </div>
          )}

          {/* Points slider & required toggle */}
          <div className="flex items-center justify-between mt-3 pt-4 border-t border-zinc-100 gap-4">
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setDemoQuestion(prev => ({ ...prev, required: !prev.required }))}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm ${demoQuestion.required ? 'bg-[#FF6B6B]/15 text-[#dc2626] border border-[#FF6B6B]/30' : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-700'}`}
              >
                Required Form Field
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Points:</span>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => setDemoQuestion(prev => ({ ...prev, points: Math.max(0, prev.points - 1) }))}
                  className="w-6 h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold flex items-center justify-center cursor-pointer text-zinc-800 border border-zinc-200 shadow-sm"
                >
                  -
                </button>
                <span className="text-xs font-extrabold text-zinc-800 min-w-[20px] text-center">{demoQuestion.points}</span>
                <button 
                  onClick={() => setDemoQuestion(prev => ({ ...prev, points: prev.points + 1 }))}
                  className="w-6 h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold flex items-center justify-center cursor-pointer text-zinc-800 border border-zinc-200 shadow-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Phone View Simulation */}
        <div className="w-full md:w-[280px] p-3.5 rounded-[44px] border-[10px] border-zinc-300 bg-zinc-100 shadow-2xl relative flex flex-col justify-between items-stretch mx-auto shrink-0 transition-transform duration-300 hover:scale-[1.02] hover:shadow-zinc-300/40">
          {/* Silver Speaker slot / Camera island */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-zinc-300 flex items-center justify-center z-20 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-400"></div>
          </div>

          {/* Simulated status bar */}
          <div className="flex justify-between items-center px-4 py-1.5 text-[9px] text-zinc-500 font-bold z-10 select-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-5 h-2.5 rounded-md border border-zinc-400 bg-zinc-300/50 p-0.5 flex items-center">
                <div className="w-full h-full bg-zinc-500 rounded"></div>
              </div>
            </div>
          </div>

          {/* Simulated Mobile screen content */}
          <div className="flex-1 my-3 bg-[#F7F8FA] rounded-[28px] p-4 text-left overflow-y-auto flex flex-col gap-4 max-h-[320px] border border-zinc-200 shadow-inner min-h-[300px]">
            {/* Mobile Header Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#6D5EF9]/10 to-[#EC4899]/10 border-l-3 border-[#6D5EF9] flex flex-col gap-0.5">
              <span className="text-[8px] font-bold text-[#6D5EF9] uppercase tracking-wider">Foryo Formix Preview</span>
              <span className="text-[10px] font-black text-zinc-800 leading-tight">Form Operations</span>
            </div>

            {/* Simulated Live Question Panel */}
            <div className="p-3.5 rounded-2xl border border-zinc-200/80 bg-white flex flex-col gap-3 shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-bold text-[#EC4899] bg-[#EC4899]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Question
                </span>
                {demoQuestion.points > 0 && (
                  <span className="text-[9px] text-[#6D5EF9] font-black bg-[#6D5EF9]/5 px-2 py-0.5 rounded">{demoQuestion.points} Points</span>
                )}
              </div>

              <h3 className="text-xs font-bold text-zinc-800 font-display leading-tight">
                {demoQuestion.title || <span className="text-zinc-400 italic font-medium">Untitled Question</span>}
                {demoQuestion.required && <span className="text-[#FF6B6B] ml-0.5 font-bold">*</span>}
              </h3>

              {/* Options Render */}
              <div className="flex flex-col gap-2 mt-1">
                {demoQuestion.type === 'TEXT' ? (
                  <div className="w-full h-9 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-[9px] text-zinc-400 flex items-center font-medium">
                    Short text answer key field...
                  </div>
                ) : (
                  demoQuestion.choices.map((choice, i) => (
                    <div 
                      key={i} 
                      className={`p-2.5 rounded-xl border text-[9px] flex justify-between items-center transition-all duration-300 font-semibold ${demoQuestion.correctIdx === i ? 'border-[#14B8A6]/40 bg-[#14B8A6]/8 text-[#0f766e]' : 'border-zinc-200 bg-zinc-50 text-zinc-600'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${demoQuestion.correctIdx === i ? 'border-[#14B8A6] bg-[#14B8A6]' : 'border-zinc-300 bg-white'}`}>
                          {demoQuestion.correctIdx === i && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                        </span>
                        <span>{choice || <span className="opacity-30 italic font-medium">Option {i + 1}</span>}</span>
                      </div>
                      {demoQuestion.correctIdx === i && (
                        <span className="text-[7px] font-black bg-[#14B8A6]/10 px-1.5 py-0.5 rounded text-[#14B8A6] tracking-wider uppercase">KEY</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer simulation */}
            <div className="mt-auto pt-2 flex justify-between items-center border-t border-zinc-150">
              <span className="text-[8px] text-zinc-400 font-semibold uppercase tracking-wider">Synced with Forms API</span>
              <div className="w-4.5 h-4.5 rounded-full bg-[#14B8A6] flex items-center justify-center shadow-md animate-pulse" title="Cloud Connection Stable">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" className="text-white">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
          </div>

          {/* Simulated home indicator */}
          <div className="w-24 h-1.5 rounded-full bg-zinc-300 mx-auto mt-1 z-10 select-none"></div>
        </div>
      </div>
    </section>
  );
}
