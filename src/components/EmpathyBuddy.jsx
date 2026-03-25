import React, { useState } from 'react';
import { Send, Sparkles, Heart } from 'lucide-react';

const EmpathyBuddy = ({ frictionScore, energyLevel }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'aura',
      text: frictionScore > 5 
        ? "Hey friend. I noticed things have been a bit heavy lately. Don't worry about the big mountain—let's just take one tiny step today. I'm right here with you."
        : energyLevel < 35
        ? "You're running low on fuel today, aren't you? It's okay to go slow. Consistency isn't about intensity, it's about showing up. A 10-minute spark is a massive win."
        : "You're doing great! Your momentum is building steadily. Ready to dive into today's focus?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim() || isThinking) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3:latest',
          messages: [
            { 
              role: 'system', 
              content: `You are Aura, an empathetic AI companion for a growth platform called Habibi. 
              Your tone is warm, encouraging, and deeply empathetic. 
              User's current energy: ${energyLevel}%. 
              User's friction score: ${frictionScore}.
              Keep responses concise (1-2 sentences) and supportive.`
            },
            ...messages.map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            })),
            { role: 'user', content: inputValue }
          ],
          stream: false
        })
      });

      if (!response.ok) throw new Error('Ollama not responding');
      
      const data = await response.json();
      
      const auraMessage = {
        id: Date.now() + 1,
        sender: 'aura',
        text: data.message.content
      };
      setMessages(prev => [...prev, auraMessage]);
    } catch (error) {
      console.error('Ollama Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'aura',
        text: "I'm having a little trouble connecting to my creative circuits right now (Ollama might be offline), but I'm still here for you! 🕯️"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 fade-in">
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
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user' 
                ? 'bg-blue-600/20 text-blue-200 rounded-tr-none border border-blue-500/10' 
                : 'glass bg-white/5 text-slate-200 rounded-tl-none border-white/5 shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="glass bg-white/5 p-4 rounded-2xl rounded-tl-none border-white/5 text-slate-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isThinking}
            placeholder={isThinking ? "Aura is typing..." : "Share a thought..."}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors pr-12 disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={isThinking}
            className="absolute right-2 top-1.5 p-2 text-slate-500 hover:text-white transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmpathyBuddy;
