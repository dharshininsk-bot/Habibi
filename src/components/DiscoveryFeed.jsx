import React, { useState } from 'react';
import { Search, LayoutGrid, Dumbbell, Palette, Code2, ChefHat, Plus, BarChart3 } from 'lucide-react';
import PathwayCard from './PathwayCard';
import { useHabitStore } from '../lib/store';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: LayoutGrid },
  { id: 'in-progress', name: 'In Progress', icon: BarChart3 },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell },
  { id: 'art', name: 'Art', icon: Palette },
  { id: 'coding', name: 'Coding', icon: Code2 },
  { id: 'cooking', name: 'Cooking', icon: ChefHat },
];

const DiscoveryFeed = ({ onPathwaySelect, onCreateNew }) => {
  const { pathways, history } = useHabitStore();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPathways = (pathways || []).filter(p => {
    if (activeCategory === 'in-progress') {
      // A pathway is in-progress if it appears in history
      // We check pathway_id (DB), pathwayId (Local), or title matches
      return history.some(h => 
        h.pathway_id === p.id || 
        h.pathwayId === p.id || 
        h.pathway === p.title
      );
    }
    return activeCategory === 'all' || p.category === activeCategory;
  });

  return (
    <div className="fade-in text-white">
      {/* Header with Top-Right Create Button */}
      <div className="flex flex-row items-center justify-between mb-12">
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold font-sora text-white mb-2 leading-none">Available Pathways</h1>
          <p className="text-sm text-white/40 font-bold uppercase tracking-[0.2em]">Community-driven growth</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCreateNew();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap"
        >
          <Plus size={20} strokeWidth={3} />
          Create New
        </button>
      </div>

      {/* Navigation & Search Bar: COMBINED BAR */}
      <div className="glass rounded-3xl p-2 border-white/10 flex flex-row items-center gap-2 mb-12">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 no-scrollbar flex-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat.id 
                ? 'bg-white text-slate-950 shadow-lg' 
                : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <cat.icon size={14} />
              {cat.name}
            </button>
          ))}
        </div>
        
        <div className="h-8 w-px bg-white/10 hidden md:block" />

        <div className="relative w-full md:w-72 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" />
          <input 
            type="text" 
            placeholder="Search pathways..." 
            className="w-full bg-transparent p-3 text-sm text-white outline-none font-bold placeholder:text-white/20 pl-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPathways.map((pathway) => (
          <PathwayCard 
            key={pathway.id} 
            pathway={pathway} 
            onSelect={onPathwaySelect} 
          />
        ))}
      </div>
    </div>
  );
};

export default DiscoveryFeed;
