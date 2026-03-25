import React from 'react';
import { Timer, Zap, Sparkles, Heart, ArrowRight } from 'lucide-react';

const DailyFocusCard = ({ task, energyLevel, frictionScore, onStart, activePathway }) => {
  const isRecovering = frictionScore > 4;
  const glowClass = activePathway?.category === 'fitness' ? 'hero-glow-orange' : 
                   activePathway?.category === 'art' ? 'hero-glow-purple' : 'hero-glow-blue';

  return (
    <div className={`glass-card p-0 overflow-hidden relative ${glowClass} border-white/10`}>
      {/* Dynamic Animated Glow */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none blur-3xl"
        style={{ 
          background: `radial-gradient(circle at 70% 30%, ${task.color}, transparent 50%)`
        }} 
      />

      <div className="p-8 md:p-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Today's Beat</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{activePathway?.title}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold font-sora tracking-tighter mb-6 leading-none">{task.title}</h1>
            
            <p className="text-xl text-slate-400 font-medium mb-12 italic leading-relaxed opacity-80 max-w-xl">
              "{task.reasoning}"
            </p>

            <div className="flex items-center gap-12 mb-12">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Session</span>
                <div className="flex items-center gap-2">
                  <Timer size={20} className="text-slate-400" />
                  <span className="text-3xl font-black font-sora">{task.duration}m</span>
                </div>
              </div>

              <div className="h-12 w-px bg-white/10" />

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Mode</span>
                <div className="flex items-center gap-2">
                  {isRecovering ? (
                    <div className="flex items-center gap-3 text-orange-400">
                      <Heart size={20} className="fill-orange-400/20" />
                      <span className="text-3xl font-black font-sora">Recover</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-blue-400">
                      <Zap size={20} className="fill-blue-400/20" />
                      <span className="text-3xl font-black font-sora">Flow</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={onStart}
              className="group relative flex items-center justify-center gap-4 px-12 py-5 bg-white text-slate-950 font-black text-xl rounded-2xl transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] active:scale-95"
            >
              Ignite Flow
              <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Bio-metric Energy Card */}
          <div className="lg:w-72 flex flex-col justify-between items-center bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-md">
            <div className="text-center w-full">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-8">Internal Fuel</h3>
              <div className="relative w-40 h-40 flex items-center justify-center group/energy">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                  <circle 
                    cx="80" cy="80" r="74" 
                    stroke="currentColor" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={464}
                    strokeDashoffset={464 - (464 * energyLevel / 100)}
                    strokeLinecap="round"
                    className="text-blue-500 transition-all duration-1000 ease-out"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform group-hover/energy:scale-110 duration-500">
                  <span className="text-4xl font-black font-sora">{energyLevel}%</span>
                  <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mt-1">Ready</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
               <div className="flex -space-x-3 justify-center mb-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-[3px] border-slate-950 bg-slate-800 overflow-hidden ring-1 ring-white/10">
                    <img src={`https://i.pravatar.cc/100?u=${i + 15}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">+21 Others practicing now</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyFocusCard;
