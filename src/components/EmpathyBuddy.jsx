import React from 'react';
import { Send, Sparkles, Heart } from 'lucide-react';

const EmpathyBuddy = ({ frictionScore, energyLevel }) => {
  const getInitialMessage = () => {
    if (frictionScore > 5) {
      return "Hey friend. I noticed things have been a bit heavy lately. Don't worry about the big mountain—let's just take one tiny step today. I'm right here with you.";
    }
    if (energyLevel < 35) {
      return "You're running low on fuel today, aren't you? It's okay to go slow. Consistency isn't about intensity, it's about showing up. A 10-minute spark is a massive win.";
    }
    return "You're doing great! Your momentum is building steadily. Ready to dive into today's focus?";
  };

  return (
    <div className="w-80 flex flex-col gap-4 fade-in">
      <div className="glass card border-white/5 flex flex-col h-[500px]">
        <div className="flex items-center gap-3 mb-6 p-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles size={24} className="text-white animate-pulse" />
          </div>
          <div>
            <div className="font-bold">Aura</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Empathetic AI
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          <div className="glass bg-white/5 p-4 rounded-2xl rounded-tl-none border-white/5 text-sm leading-relaxed">
            {getInitialMessage()}
          </div>
          
          <div className="flex justify-end">
            <div className="bg-blue-600/20 text-blue-200 p-4 rounded-2xl rounded-tr-none border border-blue-500/10 text-sm">
              Thanks Aura. I'm feeling a bit tired but I'll try.
            </div>
          </div>

          <div className="glass bg-white/5 p-4 rounded-2xl rounded-tl-none border-white/5 text-sm leading-relaxed">
            "I'll try" is the best phrase I've heard all day. That's where the magic starts. 🕯️
          </div>
        </div>

        <div className="mt-4 relative">
          <input 
            type="text" 
            placeholder="Share a thought..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors pr-12"
          />
          <button className="absolute right-2 top-1.5 p-2 text-slate-500 hover:text-white transition-colors">
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="glass bg-gradient-to-br from-orange-500/10 to-transparent p-6 rounded-3xl border-orange-500/10">
        <div className="flex items-center gap-3 mb-2">
          <Heart size={18} className="text-orange-400" />
          <h3 className="font-bold text-orange-200 text-sm">Self-Compassion Tip</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Remember: A "bad" workout or a "broken" habit is still 100% better than the one that didn't happen.
        </p>
      </div>
    </div>
  );
};

export default EmpathyBuddy;
