import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

const PathwayCard = ({ pathway, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(pathway)}
      className="group glass-card border-white/10 cursor-pointer relative p-2.5 bg-white/[0.02] hover:bg-white/[0.05] flex flex-col h-full"
    >
      {/* COMPACT IMAGE */}
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
        <img 
          src={pathway.thumbnail || `https://api.placeholder.com/300/225`} 
          alt={pathway.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-40" />
        
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
          <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
          <span className="text-[8px] font-black text-white uppercase tracking-tighter">
            {pathway.activeCount} Live
          </span>
        </div>
      </div>

      <div className="px-1 flex flex-col flex-1">
        <h3 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors leading-tight mb-2 font-sora">
          {pathway.title}
        </h3>
        
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-1.5 text-[9px] text-white/40 font-black uppercase tracking-widest">
             <Sparkles size={10} className="text-purple-400" />
             <span>{pathway.difficulty}</span>
          </div>
          <ChevronRight size={14} className="text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};

export default PathwayCard;
