import React from 'react';
import { X, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { useHabitStore } from '../lib/store';
import { SYLLABUS } from '../lib/habitEngine';

const CourseHistoryModal = ({ isOpen, onClose, activePathway }) => {
  const { history, badges } = useHabitStore();
  if (!isOpen) return null;

  const filteredHistory = activePathway 
    ? history.filter(item => item.pathway === activePathway.title)
    : history;

  // For custom pathways, the checklist items are the subtopics
  const checklistItems = activePathway?.subtopics?.map(s => s.title) || SYLLABUS;
  
  // A module is completed if its title exists in the history (either as a main taskTitle or a completed subtask)
  // Since we record the 'starting' module in taskTitle, we check that.
  const completedModuleTitles = filteredHistory.map(h => h.taskTitle);
  
  // Total progress - each session in history counts as one module completed in the syllabus/pathway
  const totalSubtasksCompleted = filteredHistory.length;
  const totalChecklistItems = checklistItems.length;

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
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  {totalSubtasksCompleted} / {totalChecklistItems} Steps Completed
                </p>
                {badges.includes('Speed Demon') && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold uppercase tracking-wider border border-orange-500/20">Speed Demon</span>
                )}
              </div>
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
          
          {/* Syllabus Checklist */}
          {(activePathway || !activePathway) && (
            <div className="mb-6 p-5 glass rounded-2xl border border-white/10 bg-white/[0.03]">
              <h3 className="text-sm font-bold text-white mb-4 border-b border-white/5 pb-2">Pathway Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {checklistItems.map((module, index) => {
                  // If we track by specific module completion, we check if the index has been passed
                  const isCompleted = index < totalSubtasksCompleted;
                  return (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isCompleted ? 'bg-green-500 border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'border-white/10 bg-white/5'}`}>
                        {isCompleted && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <span className={`text-[11px] font-medium transition-colors ${isCompleted ? 'text-white' : 'text-white/30'}`}>
                        <span className="text-[9px] opacity-30 mr-1.5 font-bold">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                        {module}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 px-2">Session Timeline</h3>

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
