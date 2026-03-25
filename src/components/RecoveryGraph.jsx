import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0f172a]/95 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl shadow-2xl">
        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{data.date}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="text-xl font-black text-blue-400 font-sora">{Math.round(data.momentum)}</div>
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Momentum</div>
        </div>
      </div>
    );
  }
  return null;
};

const RecoveryGraph = ({ data }) => {
  return (
    <div className="glass-card border-white/5 bg-white/[0.02]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-extrabold font-sora text-white">Recovery Pulse</h2>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1.5 opacity-60">
            Holographic Projection Phase
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Personal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Collective</span>
          </div>
        </div>
      </div>

      {/* FIXED HEIGHT CONTAINER FOR RECHARTS */}
      <div className="h-48 w-full mt-6 opacity-80" style={{ minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="glowMomentum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25}/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }}
              domain={[0, 100]}
              hide
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            
            <Area 
              type="monotone" 
              dataKey="collective" 
              stroke="#1e293b" 
              strokeWidth={1}
              fill="transparent"
              strokeDasharray="4 4"
            />

            <Area 
              type="monotone" 
              dataKey="momentum" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#glowMomentum)" 
              animationDuration={2500}
              className="drop-shadow-[0_0_10px_rgba(59,130,246,0.4)]"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RecoveryGraph;
