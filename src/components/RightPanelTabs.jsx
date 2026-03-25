import React, { useState } from 'react';
import EmpathyBuddy from './EmpathyBuddy';
import LiveChat from './LiveChat';
import { MessageSquare, Sparkles } from 'lucide-react';

const RightPanelTabs = ({ energyLevel, frictionScore, activePathway }) => {
  const [activeTab, setActiveTab] = useState('aura');

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
        <button 
          onClick={() => setActiveTab('aura')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === 'aura' ? 'bg-purple-500/20 text-purple-300' : 'text-slate-500 hover:text-white/80'}`}
        >
          <Sparkles size={14} /> Aura AI
        </button>
        <button 
          onClick={() => setActiveTab('live')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab === 'live' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500 hover:text-white/80'}`}
        >
          <MessageSquare size={14} /> Live Squad
        </button>
      </div>

      {activeTab === 'aura' ? (
        <EmpathyBuddy energyLevel={energyLevel} frictionScore={frictionScore} />
      ) : (
        <LiveChat activePathway={activePathway} />
      )}
    </div>
  );
};

export default RightPanelTabs;
