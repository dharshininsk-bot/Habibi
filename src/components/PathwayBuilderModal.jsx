import React, { useState } from 'react';
import { X, Clock, Camera, Type, Target, Sparkles, ChevronRight, Plus, Trash2, Globe, Lock } from 'lucide-react';
import { useHabitStore } from '../lib/store';

const PathwayBuilderModal = ({ isOpen, onClose }) => {
  const { addPathway } = useHabitStore();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('coding');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [isPrivate, setIsPrivate] = useState(false);
  const [subtopics, setSubtopics] = useState([
    { title: 'Introduction', duration: 10 }
  ]);

  if (!isOpen) return null;

  const addSubtopic = () => {
    setSubtopics([...subtopics, { title: '', duration: 15 }]);
  };

  const removeSubtopic = (index) => {
    setSubtopics(subtopics.filter((_, i) => i !== index));
  };

  const handleSubtopicChange = (index, field, value) => {
    const updated = [...subtopics];
    updated[index][field] = field === 'duration' ? parseInt(value) || 0 : value;
    setSubtopics(updated);
  };

  const handleConstruct = () => {
    if (!name.trim()) return alert("Please enter a pathway name");
    
    addPathway({
      title: name,
      category,
      difficulty,
      creator: 'You',
      activeCount: 0,
      enrolled: '0',
      isPrivate,
      subtopics: subtopics.filter(s => s.title.trim() !== ''),
      thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
    });
    
    onClose();
    // Reset form
    setName('');
    setSubtopics([{ title: 'Introduction', duration: 10 }]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl glass-panel rounded-5xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                <Sparkles size={20} />
             </div>
             <div>
                <h2 className="text-2xl font-bold tracking-tight">Build Your Pathway</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Custom Habit Engine</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
          {/* Pathway Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">PAWTHWAY NAME</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Philosophy Reading" 
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/30 transition-all text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">CATEGORY</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/30 transition-all text-lg appearance-none"
              >
                <option value="coding">Coding</option>
                <option value="fitness">Fitness</option>
                <option value="art">Art</option>
                <option value="cooking">Cooking</option>
              </select>
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 ml-1">VISIBILITY</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsPrivate(false)}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${!isPrivate ? 'bg-blue-600/10 border-blue-500 text-blue-400' : 'bg-white/5 border-white/5 text-slate-500'}`}
              >
                <Globe size={18} /> <span className="font-bold">Public</span>
              </button>
              <button 
                onClick={() => setIsPrivate(true)}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${isPrivate ? 'bg-purple-600/10 border-purple-500 text-purple-400' : 'bg-white/5 border-white/5 text-slate-500'}`}
              >
                <Lock size={18} /> <span className="font-bold">Private</span>
              </button>
            </div>
          </div>

          {/* Subtopics Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-widest">Modules & Subtopics</label>
              <button 
                onClick={addSubtopic}
                className="text-xs font-black text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors"
              >
                <Plus size={14} /> ADD MODULE
              </button>
            </div>
            
            <div className="space-y-3">
              {subtopics.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-3 animate-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex-1 bg-slate-900/50 border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3">
                    <span className="text-xs font-black text-slate-600 w-4">{idx + 1}</span>
                    <input 
                      type="text"
                      value={sub.title}
                      onChange={(e) => handleSubtopicChange(idx, 'title', e.target.value)}
                      placeholder="Module title..."
                      className="bg-transparent border-none outline-none flex-1 text-sm font-bold text-white placeholder:text-white/10"
                    />
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                      <Clock size={12} className="text-slate-400" />
                      <input 
                        type="number"
                        value={sub.duration}
                        onChange={(e) => handleSubtopicChange(idx, 'duration', e.target.value)}
                        className="bg-transparent border-none outline-none w-8 text-xs font-black text-blue-400 text-center"
                      />
                      <span className="text-[10px] font-black text-slate-600">M</span>
                    </div>
                  </div>
                  {subtopics.length > 1 && (
                    <button 
                      onClick={() => removeSubtopic(idx)}
                      className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all border border-red-500/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-slate-950/20 shrink-0">
          <button 
            onClick={handleConstruct}
            className="w-full py-5 bg-white text-slate-950 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all"
          >
            Construct Pathway <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathwayBuilderModal;
