import React from 'react';
import { Zap, Timer, Flame, ArrowRight, AlertCircle } from 'lucide-react';

const ElasticTaskCard = ({ task, energyLevel, frictionScore, onStart }) => {
  const isHighFriction = frictionScore > 5;
  
  return (
    <div className={`glass card fade-in relative overflow-hidden ${isHighFriction ? 'border-orange-500/30' : 'border-white/10'}`}>
      {/* Background Decor */}
      <div 
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px]" 
        style={{ backgroundColor: `${task.color}15` }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider"
                style={{ backgroundColor: `${task.color}20`, color: task.color, border: `1px solid ${task.color}30` }}
              >
                Level {task.level}: {task.title}
              </span>
              {isHighFriction && (
                <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                  <AlertCircle size={10} /> Friction Barrier
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {task.duration}m <span className="text-slate-500 font-medium">Session</span>
            </h1>
            <p className="text-slate-400 max-w-md italic">
              "{task.reasoning}"
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Energy Level</div>
            <div className="flex items-end gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-3 rounded-t-sm transition-all duration-500 ${i < Math.ceil(energyLevel / 20) ? 'bg-accent-blue' : 'bg-slate-800'}`}
                  style={{ height: `${(i + 1) * 6}px` }}
                />
              ))}
            </div>
            <div className="text-xl font-bold text-accent-blue">{energyLevel}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass bg-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <Timer size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Focus Time</div>
              <div className="font-bold">{task.duration} mins</div>
            </div>
          </div>
          
          <div className="glass bg-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Intensity</div>
              <div className="font-bold">{task.level === 3 ? 'High' : task.level === 2 ? 'Moderate' : 'Gentle'}</div>
            </div>
          </div>

          <div className="glass bg-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <Flame size={20} />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Momentum</div>
              <div className="font-bold">+{task.level * 10} pts</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={onStart}
            className="group relative flex items-center gap-3 px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl transition-all hover:pr-10 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95"
          >
            Start Session
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live verification active
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElasticTaskCard;
