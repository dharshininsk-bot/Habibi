import React, { useState, useMemo } from 'react';
import { History } from 'lucide-react';
import DiscoveryFeed from './components/DiscoveryFeed';
import DailyFocusCard from './components/DailyFocusCard';
import RightPanelTabs from './components/RightPanelTabs';
import RecoveryGraph from './components/RecoveryGraph';
import MiniGallery from './components/MiniGallery';
import FloatingActionButton from './components/FloatingActionButton'; // Kept as fall-back or removed depending on feel
import PathwayBuilderModal from './components/PathwayBuilderModal';
import LiveParticipants from './components/LiveParticipants';
import SelfCompassionTip from './components/SelfCompassionTip';
import DailySpaceDashboard from './components/DailySpaceModal';
import UploadPromptModal from './components/UploadPromptModal';
import CourseHistoryModal from './components/CourseHistoryModal';
import { calculateDailyTask, calculateFrictionScore } from './lib/habitEngine';
import { useHabitStore } from './lib/store';
import './index.css';

const App = () => {
  const [activePathway, setActivePathway] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isDailySpaceOpen, setIsDailySpaceOpen] = useState(false);
  const [isUploadPromptOpen, setIsUploadPromptOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(80);
  const [frictionData, setFrictionData] = useState({ inactivity: 1, skips: 2, incomplete: 1 });

  const { history, galleryEntries } = useHabitStore();

  const frictionScore = useMemo(() => 
    calculateFrictionScore(frictionData.inactivity, frictionData.skips, frictionData.incomplete),
    [frictionData]
  );

  const completedCountForActive = useMemo(() => {
    if (!activePathway) return 0;
    return history.filter(h => h.pathway === activePathway.title).length;
  }, [history, activePathway]);

  const currentTask = useMemo(() => 
    calculateDailyTask(frictionScore, energyLevel, completedCountForActive, activePathway), 
    [frictionScore, energyLevel, completedCountForActive, activePathway]
  );

  const momentumData = useMemo(() => {
    // Calculate a dynamic momentum score for 'Today' based on history completions
    const baseMomentumToday = 70;
    const dynamicMomentum = Math.min(100, baseMomentumToday + (history.length * 5));

    const rawData = [
      { date: 'Mon', momentum: 40, collective: 60 },
      { date: 'Tue', momentum: 45, collective: 62 },
      { date: 'Wed', momentum: 55, collective: 65 },
      { date: 'Thu', momentum: 70, collective: 68 },
      { date: 'Fri', momentum: 85, collective: 70 },
      { date: 'Sat', momentum: 60, collective: 72 }, // deliberate drop to show disengagement
      { date: 'Today', momentum: dynamicMomentum, collective: 75 },
    ];

    let lastState = 'progress';
    return rawData.map((d, i) => {
      if (i === 0) return { ...d, state: 'progress' };
      const prev = rawData[i - 1];
      let state = 'progress';
      
      if (d.momentum < prev.momentum) {
        state = 'disengagement';
      } else if (d.momentum > prev.momentum && lastState === 'disengagement') {
        state = 'recovery';
      } else if (d.momentum > prev.momentum && prev.momentum < rawData[Math.max(0, i - 2)].momentum) {
        state = 'recovery';
      } else {
        state = 'progress';
      }
      
      lastState = state;
      return { ...d, state };
    });
  }, [history]);



  if (isDailySpaceOpen) {
    return (
      <React.Fragment>
        <DailySpaceDashboard 
          isOpen={isDailySpaceOpen} 
          onClose={() => setIsDailySpaceOpen(false)} 
          frictionScore={frictionScore} 
          energyLevel={energyLevel}
          activePathway={activePathway} 
          task={currentTask}
          onFinish={() => {
            setIsDailySpaceOpen(false);
            setIsUploadPromptOpen(true);
          }}
        />
        <UploadPromptModal 
          isOpen={isUploadPromptOpen} 
          onClose={() => setIsUploadPromptOpen(false)} 
        />
      </React.Fragment>
    );
  }

  return (
    <div className="midnight-gradient min-h-screen text-white font-inter">
      <div className="max-w-5xl mx-auto px-6 w-full flex flex-col min-h-screen">
        
        {/* Nav: Ultra-Premium Minimalist */}
        <nav className="flex items-center justify-between py-10 mb-8 border-b border-white/5">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActivePathway(null)}
          >
            <div className="w-10 h-10 rounded-2xl bg-white text-slate-950 flex items-center justify-center font-black text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform duration-500">H</div>
            <span className="font-sora font-extrabold text-2xl tracking-tighter">Habibi</span>
          </div>

          <div className="flex items-center gap-6">
            {activePathway && (
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 active:scale-95 transition-all shadow-inner animate-in fade-in zoom-in"
              >
                <History size={16} strokeWidth={2.5} />
                <span className="text-[10px] uppercase tracking-widest hidden sm:inline text-white/70">Course History</span>
              </button>
            )}
            <div className="w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center font-bold text-[10px] text-white/40 shadow-inner">UA</div>
          </div>
        </nav>

        <main className="flex-1 pb-32">
          {!activePathway ? (
            <DiscoveryFeed 
              onPathwaySelect={setActivePathway} 
              onCreateNew={() => setIsBuilderOpen(true)}
            />
          ) : (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                  <DailyFocusCard 
                    task={currentTask}
                    energyLevel={energyLevel}
                    frictionScore={frictionScore}
                    activePathway={activePathway}
                    onEnergyChange={setEnergyLevel}
                    onStart={() => setIsDailySpaceOpen(true)}
                  />
                  <RecoveryGraph data={momentumData} />
                </div>
                <div className="lg:col-span-4 h-full flex flex-col gap-4">
                   <div className="lg:col-span-4 sticky top-28 h-fit">
                   <RightPanelTabs energyLevel={energyLevel} frictionScore={frictionScore} activePathway={activePathway} />
                </div>     <div className="grid grid-cols-1 gap-4">
                       <LiveParticipants />
                       <SelfCompassionTip />
                     </div>
                   </div>
                </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                  <MiniGallery 
                    entries={galleryEntries} 
                    onAdd={() => setIsUploadPromptOpen(true)} 
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <UploadPromptModal 
        isOpen={isUploadPromptOpen} 
        onClose={() => setIsUploadPromptOpen(false)} 
      />
      
      <CourseHistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        activePathway={activePathway}
      />

      <PathwayBuilderModal 
        isOpen={isBuilderOpen} 
        onClose={() => setIsBuilderOpen(false)} 
      />
    </div>
  );
};

export default App;
