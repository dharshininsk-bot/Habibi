import React, { useState } from 'react';
import { X, Trophy, FastForward, PlayCircle, CheckCircle } from 'lucide-react';

const DailySpaceDashboard = ({ isOpen, onClose, frictionScore, activePathway, task, onFinish }) => {
  const [speed, setSpeed] = useState(1); // 1 = normal, 2 = fast, 3 = super fast
  const [completedBeads, setCompletedBeads] = useState([]);

  if (!isOpen) return null;

  const isHighFriction = frictionScore >= 7;

  // Specific Subtask Names based on context
  const getSubtasks = () => {
    if (isHighFriction) {
      return [{ id: 0, title: 'Micro-Review of Core Principles', duration: '10m' }];
    }
    return [
      { id: 0, title: 'Warm-up & Concept Review', duration: '10m' },
      { id: 1, title: 'Practical Implementation', duration: '20m' },
      { id: 2, title: 'Debugging & Refinement', duration: '15m' },
      { id: 3, title: 'Peer Code Review', duration: '10m' },
      { id: 4, title: 'Final Documentation', duration: '5m' }
    ];
  };

  const beads = getSubtasks();
  const taskCount = beads.length;
  
  // Calculate completion percentage manually
  const progress = taskCount > 0 ? Math.round((completedBeads.length / taskCount) * 100) : 0;

  const handleBeadClick = (id) => {
    setCompletedBeads(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  // Bead gap style based on speed (visualizing momentum)
  const gapStyle = speed === 3 ? 'gap-2' : speed === 2 ? 'gap-8' : 'gap-16';

  const displayDuration = (durationString, currentSpeed) => {
    const min = parseInt(durationString.replace('m',''));
    const actual = Math.max(1, Math.round(min / currentSpeed));
    return `${actual}m`;
  };

  return (
    <div className="midnight-gradient min-h-screen w-full flex flex-col text-white font-inter animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="w-full p-6 md:px-12 md:py-8 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
        <div>
          <h2 className="text-4xl md:text-5xl font-sora font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-2">
              {task?.title || 'Daily Session'}
            </h2>
            <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">
              {activePathway?.title || 'Pathway'} • {isHighFriction ? 'High Friction (Micro)' : 'Deep Work'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all font-bold text-sm tracking-widest uppercase active:scale-95"
          >
            <X size={18} /> Exit Flow
          </button>
        </div>

        {/* Momentum Progress Bar */}
        <div className="w-full px-6 md:px-12 pt-10">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-black uppercase tracking-widest text-green-400">Total Completion</span>
            <span className="text-xs font-black text-white/50">Speed: {speed}x Flow</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Speed Controls (Demo purposes for Developer A) */}
        <div className="flex gap-4 mt-6">
          {[1, 2, 3].map(v => (
            <button 
              key={v}
              onClick={() => setSpeed(v)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-sm transition-colors ${
                speed === v ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <FastForward size={14} /> {v}x Flow
            </button>
          ))}
        </div>

        {/* Timeline "Beads on a String" */}
        <div className="flex-1 w-full flex flex-col items-center justify-center overflow-y-auto px-8 py-12 hide-scrollbar">
          <div className={`flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] ${gapStyle}`}>
            {beads.map((bead) => {
              const isPast = completedBeads.includes(bead.id);
              return (
                <div 
                  key={bead.id} 
                  className="flex flex-col items-center group cursor-pointer"
                  onClick={() => handleBeadClick(bead.id)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isPast ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-white/10 text-white/40 border-2 border-white/5 hover:bg-white/20'}`}>
                    {isPast ? <CheckCircle size={24} className="text-white" /> : <PlayCircle size={24} className="text-white/60 group-hover:text-white" />}
                  </div>
                  <div className="mt-3 text-center transition-all duration-500 transform group-hover:scale-105">
                    <div className={`text-sm font-black tracking-wide ${isPast ? 'text-green-300' : 'text-white'}`}>{bead.title}</div>
                    
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                      {speed > 1 ? (
                        <div className="flex items-center gap-1.5 justify-center">
                          <span className="line-through text-white/20">{bead.duration}</span>
                          <span className="text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-md border border-green-500/20">
                            {displayDuration(bead.duration, speed)}
                          </span>
                        </div>
                      ) : (
                        <span>{bead.duration}</span>
                      )}
                    </div>

                  </div>
                </div>
               );
            })}
          </div>
        </div>

        {/* Footer / Completion */}
        <div className="w-full p-8 border-t border-white/5 bg-white/[0.01] flex justify-center mt-auto">
          <button 
            onClick={onFinish}
            disabled={progress < 100}
            className={`px-12 py-5 rounded-2xl font-black text-xl uppercase tracking-widest flex items-center gap-3 transition-all ${
              progress >= 100 
              ? 'bg-white text-slate-950 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]' 
              : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            <Trophy size={24} />
            Complete Session
          </button>
        </div>
    </div>
  );
};

export default DailySpaceDashboard;
