import React from 'react';
import { X, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

const CourseHistoryModal = ({ isOpen, onClose, activePathway }) => {
  if (!isOpen) return null;

  const mockHistory = [
    { id: 1, date: 'Mar 24', pathway: 'Bodyweight Mastery', taskTitle: 'Advanced Pushup Progressions', timeSpent: '45m', completedSubtasks: 5 },
    { id: 2, date: 'Mar 23', pathway: 'Bodyweight Mastery', taskTitle: 'Core Warm-up', timeSpent: '10m', completedSubtasks: 1, type: 'spark' },
    { id: 3, date: 'Mar 21', pathway: 'Unity Fundamentals', taskTitle: 'Physics Engine Basics', timeSpent: '60m', completedSubtasks: 6 },
    { id: 4, date: 'Mar 19', pathway: 'Unity Fundamentals', taskTitle: 'Camera Tracking & Transforms', timeSpent: '60m', completedSubtasks: 6 },
    { id: 5, date: 'Mar 18', pathway: 'Python for Data Science', taskTitle: 'Variables & Data Types', timeSpent: '45m', completedSubtasks: 5 },
    { id: 6, date: 'Mar 17', pathway: 'Python for Data Science', taskTitle: 'Hello World & Setup', timeSpent: '10m', completedSubtasks: 1, type: 'spark' },
  ];

  const filteredHistory = activePathway 
    ? mockHistory.filter(item => item.pathway === activePathway.title)
    : mockHistory;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden glass-card flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h2 className="text-xl font-sora font-extrabold text-white">Course History</h2>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Your past momentum</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {filteredHistory.length === 0 && (
            <div className="text-center py-6 text-white/50 text-sm font-bold">
              No history found for {activePathway?.title}.
            </div>
          )}
          {filteredHistory.map((item) => (
            <div key={item.id} className="flex gap-4 group">
              {/* Timeline dot */}
              <div className="flex flex-col items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] z-10" />
                <div className="w-px h-full bg-white/10 group-last:hidden" />
              </div>

              {/* Card */}
              <div className="flex-1 glass p-4 rounded-2xl border-white/5 hover:border-white/20 transition-colors mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col">
                    <span className="text-white font-bold font-sora text-sm">{item.taskTitle}</span>
                    <span className="text-[10px] text-white/40 tracking-wider uppercase mt-1">{item.pathway}</span>
                  </div>
                  <span className="text-xs font-black text-white/40 uppercase">{item.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-white/60 uppercase tracking-wider">
                    <CheckCircle2 size={12} className={item.type === 'spark' ? 'text-orange-400' : 'text-green-400'} />
                    {item.completedSubtasks} {item.completedSubtasks === 1 ? 'Spark' : 'Subtasks'}
                  </div>
                  <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                    {item.timeSpent} Session
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center py-6">
            <p className="text-sm text-white/30 font-medium italic">End of history.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHistoryModal;
