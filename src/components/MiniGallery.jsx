import React from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';

const MiniGallery = ({ entries, onAdd }) => {
  return (
    <div className="glass-card border-white/5 bg-white/[0.01]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold font-sora">The Tapestry</h2>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.3em] mt-1.5 opacity-60">Continuous Growth Thread</p>
        </div>
      </div>

      <div className="tapestry-row custom-scrollbar">
        {entries.map((entry, i) => (
          <div 
            key={i} 
            className="tapestry-item w-40 aspect-[4/5] glass rounded-3xl border-white/5 p-1.5 relative group cursor-pointer hover:border-white/20 transition-all"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              {entry.imageUrl ? (
                <img 
                  src={entry.imageUrl} 
                  alt="Progress" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center text-slate-700">
                  <ImageIcon size={24} />
                </div>
              )}
              
              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Day {entry.day}</span>
                <span className="text-[8px] font-black uppercase text-blue-400 tracking-widest leading-none">{entry.energy}% Fuel</span>
              </div>

              {/* Intensity Node */}
              <div 
                className="absolute top-4 right-4 w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: entry.level === 3 ? '#a855f7' : entry.level === 2 ? '#fb923c' : '#60a5fa',
                  boxShadow: `0 0 15px ${entry.level === 3 ? '#a855f7' : entry.level === 2 ? '#fb923c' : '#60a5fa'}`
                }} 
              />
            </div>
          </div>
        ))}
        
        {/* Placeholder Polaroid */}
        <div 
          onClick={onAdd}
          className="tapestry-item w-40 aspect-[4/5] flex items-center justify-center rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02] text-slate-800 hover:border-white/20 hover:text-slate-500 transition-all cursor-pointer group"
        >
           <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
};

export default MiniGallery;
