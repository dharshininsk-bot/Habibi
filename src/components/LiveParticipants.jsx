import React from 'react';
import { Users } from 'lucide-react';

const LiveParticipants = ({ count = 21 }) => {
  return (
    <div className="glass bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Live Session</h3>
          </div>
          <p className="text-[10px] text-slate-500 font-bold italic">
            +{count} others practicing now
          </p>
        </div>

        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map(i => (
            <div 
              key={i} 
              className="w-10 h-10 rounded-full border-[3px] border-slate-950 bg-slate-800 overflow-hidden ring-1 ring-white/10 hover:translate-y-[-4px] transition-transform duration-300"
            >
              <img 
                src={`https://i.pravatar.cc/100?u=${i + 15}`} 
                alt="user" 
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveParticipants;
