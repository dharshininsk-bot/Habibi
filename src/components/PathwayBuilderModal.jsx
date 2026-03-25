import React, { useState } from 'react';
import { X, Clock, Camera, Type, Target, Sparkles, ChevronRight } from 'lucide-react';

const PathwayBuilderModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl glass-panel rounded-5xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
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

        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            {/* Field 1: Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">PAWTHWAY NAME</label>
              <input 
                type="text" 
                placeholder="e.g., Morning Philosophy Reading" 
                className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/30 transition-all text-lg"
              />
            </div>

            {/* Field 2: Time Settings */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2">
                   <Clock size={14} className="text-blue-400" /> MICRO-SPARK (Mins)
                </label>
                <input 
                  type="number" 
                  defaultValue={10}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1 flex items-center gap-2">
                   <Target size={14} className="text-purple-400" /> DEEP-DIVE (Mins)
                </label>
                <input 
                  type="number" 
                  defaultValue={60}
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/30 transition-all"
                />
              </div>
            </div>

            {/* Field 3: Verification Method */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-400 ml-1">VERIFICATION METHOD</label>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-3 p-6 rounded-3xl border-2 border-blue-500/50 bg-blue-500/10 text-blue-400 transition-all">
                  <Camera size={32} />
                  <span className="font-bold">Photo Proof</span>
                </button>
                <button className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-white/5 bg-white/5 text-slate-400 hover:border-white/20 transition-all">
                  <Type size={32} />
                  <span className="font-bold">Text Devlog</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-slate-950/20">
          <button className="w-full py-5 bg-white text-slate-950 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-[0.98] transition-all">
            Construct Pathway <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathwayBuilderModal;
