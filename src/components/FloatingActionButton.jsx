import React from 'react';
import { Plus } from 'lucide-react';

const FloatingActionButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-10 right-10 w-16 h-16 rounded-full bg-white text-slate-950 shadow-[0_10px_40px_rgba(255,255,255,0.2)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[90] group"
    >
      <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 px-4 py-2 glass-panel rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-white">
        Create Your Own
      </div>
    </button>
  );
};

export default FloatingActionButton;
