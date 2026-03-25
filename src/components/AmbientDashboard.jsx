import React from 'react';
import { Users, BookOpen, ChevronRight, MessageSquare } from 'lucide-react';

const AmbientDashboard = ({ children, activeUsersCount = 14, currentPathway = "Unity Fundamentals" }) => {
  return (
    <div className="min-h-screen flex flex-col ambient-bg">
      {/* Top Bar: Ambient Presence */}
      <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">H</div>
            <span className="font-bold text-xl tracking-tight">Habibi</span>
          </div>
          
          <div className="h-6 w-px bg-white/10" />
          
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <BookOpen size={16} />
            <span className="hover:text-white cursor-pointer transition-colors">{currentPathway}</span>
            <ChevronRight size={14} />
            <span className="text-white font-medium">Daily Focus</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full border-blue-500/20">
            <div className="relative">
              <Users size={18} className="text-blue-400" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-slate-900" />
            </div>
            <span className="text-xs font-medium text-slate-300">
              <span className="text-white">{activeUsersCount} others</span> practicing now
            </span>
          </div>
          
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold"
                style={{ 
                  background: `linear-gradient(${i * 45}deg, #1e293b, #334155)`,
                  borderColor: '#020617'
                }}
              >
                U{i}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 container mx-auto px-6 py-8 flex gap-8">
        <div className="flex-1 flex flex-col gap-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AmbientDashboard;
