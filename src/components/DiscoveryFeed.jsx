import React, { useState } from 'react';
import { Search, LayoutGrid, Dumbbell, Palette, Code2, ChefHat, Plus } from 'lucide-react';
import PathwayCard from './PathwayCard';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: LayoutGrid },
  { id: 'fitness', name: 'Fitness', icon: Dumbbell },
  { id: 'art', name: 'Art', icon: Palette },
  { id: 'coding', name: 'Coding', icon: Code2 },
  { id: 'cooking', name: 'Cooking', icon: ChefHat },
];

const MOCK_PATHWAYS = [
  {
    id: 'unity-basics',
    title: 'Unity Fundamentals',
    category: 'coding',
    creator: 'DevXavier',
    activeCount: 450,
    enrolled: '12.4k',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'oil-painting',
    title: 'Traditional Oil Painting',
    category: 'art',
    creator: 'ArtistSola',
    activeCount: 120,
    enrolled: '3.1k',
    difficulty: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'bodyweight-pro',
    title: 'Bodyweight Mastery',
    category: 'fitness',
    creator: 'FitCoach',
    activeCount: 890,
    enrolled: '25k',
    difficulty: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'sourdough',
    title: 'The Sourdough Journey',
    category: 'cooking',
    creator: 'BakerBen',
    activeCount: 304,
    enrolled: '8k',
    difficulty: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1585478259715-876a6a81fc08?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ui-motion',
    title: 'UI Motion & Animation',
    category: 'art',
    creator: 'DesignDua',
    activeCount: 56,
    enrolled: '1.2k',
    difficulty: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'python-data',
    title: 'Python for Data Science',
    category: 'coding',
    creator: 'DataWiz',
    activeCount: 220,
    enrolled: '15k',
    difficulty: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop'
  }
];

const DiscoveryFeed = ({ onPathwaySelect, onCreateNew }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPathways = MOCK_PATHWAYS.filter(p => 
    activeCategory === 'all' || p.category === activeCategory
  );

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
