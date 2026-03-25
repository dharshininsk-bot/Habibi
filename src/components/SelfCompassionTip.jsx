import React from 'react';
import { Heart } from 'lucide-react';

const SelfCompassionTip = () => {
  return (
    <div className="glass bg-gradient-to-br from-orange-500/10 to-transparent p-6 rounded-3xl border-orange-500/10 animate-in fade-in slide-in-from-right-4 duration-1000">
      <div className="flex items-center gap-3 mb-2">
        <Heart size={18} className="text-orange-400" />
        <h3 className="font-bold text-orange-200 text-sm">Self-Compassion Tip</h3>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">
        Remember: A "bad" workout or a "broken" habit is still 100% better than the one that didn't happen.
      </p>
    </div>
  );
};

export default SelfCompassionTip;
