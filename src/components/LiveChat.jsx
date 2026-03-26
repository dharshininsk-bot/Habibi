import React, { useState, useEffect, useRef } from 'react';
import { Send, Users } from 'lucide-react';
import { useHabitStore } from '../lib/store';
import LiveParticipants from './LiveParticipants';

const LiveChat = ({ activePathway, currentTask }) => {
  const { activeUsers, user } = useHabitStore();
  const moduleName = currentTask?.moduleTitle || activePathway?.title || 'General';

  const [messages, setMessages] = useState([
    { id: 'system-1', sender: 'System', text: `Welcome to the ${moduleName} live session!` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch existing discussion and Subscribe to SSE stream
  useEffect(() => {
    let sse;
    const token = localStorage.getItem('habibi_token');

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat/${encodeURIComponent(moduleName)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const pastMessages = await res.json();
          setMessages([
            { id: 'system-1', sender: 'System', text: `Welcome to the ${moduleName} live session!` },
            ...pastMessages
          ]);
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };

    fetchHistory();

    // Setup SSE connection for live updates
    sse = new EventSource(`/api/chat/stream?module=${encodeURIComponent(moduleName)}`);
    
    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => {
        // Prevent dupes if we already sent this explicitly (optimistic update)
        if (prev.find(m => m.id === data.id)) return prev;
        return [...prev, data];
      });
    };
    
    // Auto-reconnect on error handled by browser
    sse.onerror = (e) => {
      console.log('SSE connectivity state changed:', e);
    };

    return () => {
      if (sse) sse.close();
    };
  }, [moduleName]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const text = inputValue;
    setInputValue('');

    try {
      const token = localStorage.getItem('habibi_token');
      const res = await fetch(`/api/chat/${encodeURIComponent(moduleName)}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      if (!res.ok) {
        setInputValue(text); // Restore on error
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setInputValue(text); // Restore on error
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 fade-in">
      <LiveParticipants count={activeUsers.length} currentTask={currentTask} />
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

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
          {messages.map((msg) => {
            const isMe = msg.sender === 'You' || (user && msg.sender === user.username);
            
            return (
              <div key={msg.id} className={`flex ${msg.sender === 'System' ? 'justify-center' : isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[85%] ${
                  isMe 
                  ? 'bg-emerald-600/20 text-emerald-200 rounded-tr-none border border-emerald-500/10' 
                  : msg.sender === 'System'
                  ? 'w-full text-center text-[10px] uppercase tracking-widest text-slate-500 italic bg-transparent'
                  : 'glass bg-white/5 text-slate-200 rounded-tl-none border-white/5 shadow-sm'
                }`}>
                  {!isMe && msg.sender !== 'System' && (
                    <div className="text-[10px] text-emerald-400 font-bold mb-1">{msg.sender}</div>
                  )}
                  {msg.text}
                </div>
              </div>
            );
          })}
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
