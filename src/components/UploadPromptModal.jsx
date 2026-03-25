import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X, Upload } from 'lucide-react';
import { useHabitStore } from '../lib/store';

const UploadPromptModal = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const { addGalleryEntry } = useHabitStore();
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      addGalleryEntry({ energy: 100, level: 3, imageUrl });
      onClose();
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-[30px] p-8 shadow-2xl glass-card animate-in zoom-in-95 fade-in duration-300 flex flex-col items-center">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center mb-6">
          <Camera className="text-white" size={28} />
        </div>

        <h3 className="text-2xl font-sora font-extrabold text-white text-center mb-2">
          Capture the Moment
        </h3>
        <p className="text-slate-400 text-center text-sm font-medium mb-8 leading-relaxed">
          You crushed today's session. Add a photo or quick video to your personal journey album.
        </p>

        <div 
          className={`w-full aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group ${
            dragActive ? 'border-purple-400 bg-purple-500/10' : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          <div className="flex gap-4 text-white/30 group-hover:text-white/60 transition-colors">
            <ImageIcon size={32} />
            <Upload size={32} />
          </div>
          <p className="text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-white/80 transition-colors">
            Tap or drop media here
          </p>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 text-sm font-bold text-white/30 hover:text-white transition-colors uppercase tracking-widest"
        >
          Skip for now
        </button>

      </div>
    </div>
  );
};

export default UploadPromptModal;
