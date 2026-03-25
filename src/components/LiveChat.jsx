import React, { useState, useEffect } from 'react';
import { Send, Users } from 'lucide-react';
import { useHabitStore } from '../lib/store';
import LiveParticipants from './LiveParticipants';

const LiveChat = ({ activePathway }) => {
  const { activeUsers } = useHabitStore();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'System', text: `Welcome to the ${activePathway?.title || 'General'} live session!` },
    { id: 2, sender: 'Bob', text: 'Hey everyone, just starting the first subtask.' }
  ]);
  const [inputValue, setInputValue] = useState('');

  // Mock WebSocket listener
  useEffect(() => {
    const timer = setInterval(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now(), 
          sender: activeUsers[Math.floor(Math.random() * activeUsers.length)]?.name || 'User', 
          text: ["Keep it up!", "This friction is real.", "Just finished the spark!", "Let's goooo!"][Math.floor(Math.random() * 4)] 
        }
      ]);
    }, 15000); // Random message every 15s

    return () => clearInterval(timer);
  }, [activeUsers]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'You', text: inputValue }]);
    setInputValue('');
  };

  return (
    <div className="w-full flex flex-col gap-4 fade-in">
      <LiveParticipants count={activeUsers.length} />
      <div className="glass card border-white/5 flex flex-col h-[400px]">
        <div className="flex items-center gap-3 mb-6 p-2 border-b border-white/5 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-2">
              Module Chat <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">
              Live Collaboration
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[85%] ${
                msg.sender === 'You' 
                ? 'bg-emerald-600/20 text-emerald-200 rounded-tr-none border border-emerald-500/10' 
                : msg.sender === 'System'
                ? 'w-full text-center text-[10px] uppercase tracking-widest text-slate-500 italic bg-transparent'
                : 'glass bg-white/5 text-slate-200 rounded-tl-none border-white/5 shadow-sm'
              }`}>
                {msg.sender !== 'You' && msg.sender !== 'System' && (
                  <div className="text-[10px] text-emerald-400 font-bold mb-1">{msg.sender}</div>
                )}
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Encourage the group..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-colors pr-12"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1.5 p-2 text-slate-500 hover:text-white transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
