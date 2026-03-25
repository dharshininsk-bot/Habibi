import React from 'react';
import { Timer, Zap, Sparkles, Heart, ArrowRight } from 'lucide-react';

const DailyFocusCard = ({ task, energyLevel, frictionScore, onStart, activePathway, onEnergyChange }) => {
  const isRecovering = frictionScore > 4;

  // Circular Slider Logic
  const size = 100;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (energyLevel / 100) * circumference;

  const handleMouseDown = (e) => {
    const updateEnergy = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left - center;
      const y = e.clientY - rect.top - center;
      let angle = Math.atan2(y, x) + Math.PI / 2;
      if (angle < 0) angle += 2 * Math.PI;
      const percentage = Math.round((angle / (2 * Math.PI)) * 100);
      onEnergyChange(Math.max(0, Math.min(100, percentage)));
    };

    updateEnergy(e);
    
    const onMouseMove = (moveEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = moveEvent.clientX - rect.left - center;
      const y = moveEvent.clientY - rect.top - center;
      let angle = Math.atan2(y, x) + Math.PI / 2;
      if (angle < 0) angle += 2 * Math.PI;
      const percentage = Math.round((angle / (2 * Math.PI)) * 100);
      onEnergyChange(Math.max(0, Math.min(100, percentage)));
    };

    const stopDrag = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stopDrag);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stopDrag);
  };

  // Handle Coordinates
  const handleAngle = (energyLevel / 100) * 2 * Math.PI - Math.PI / 2;
  const handleX = center + radius * Math.cos(handleAngle);
  const handleY = center + radius * Math.sin(handleAngle);

  return (
    <div className="glass-card p-0 overflow-hidden relative border-white/10">
      {/* Dynamic Animated Glow */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none blur-3xl"
        style={{ 
          background: `radial-gradient(circle at 70% 30%, ${task.color}, transparent 50%)`
        }} 
      />

      <div className="p-8 md:p-12 relative z-10">
        <div className="flex flex-col gap-16">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-8">
              <span 
                className="text-[10px] font-black uppercase tracking-[0.3em]"
                style={{ color: task.color }}
              >
                Today's Beat
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{activePathway?.title}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold font-sora tracking-tighter mb-6 leading-none">{task.moduleTitle || task.title}</h1>
            
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
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Energy Flow</span>
                <div className="flex items-center gap-4">
                  <div 
                    className="relative cursor-pointer group active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                  >
                    <svg width={size} height={size} className="overflow-visible">
                      <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-white/5"
                      />
                      <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={task.color}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-300 ease-out drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                        transform={`rotate(-90 ${center} ${center})`}
                      />
                      {/* Interactive Knob */}
                      <circle
                        cx={handleX}
                        cy={handleY}
                        r={strokeWidth * 0.8}
                        fill="white"
                        className="transition-all duration-300 ease-out shadow-xl"
                        style={{ filter: `drop-shadow(0 0 10px ${task.color})` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Zap size={14} className="text-white opacity-40" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black font-sora" style={{ color: task.color }}>{energyLevel}%</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Current Flow</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={onStart}
              className="group relative flex items-center justify-center gap-4 px-12 py-5 bg-white text-slate-950 font-black text-xl rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
              style={{ boxShadow: `0 0 50px ${task.color}33` }}
            >
              Ignite Flow
              <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyFocusCard;
