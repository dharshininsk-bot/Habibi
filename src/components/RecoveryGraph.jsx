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

const getColorByState = (state) => {
  if (state === 'progress') return '#10b981'; // emerald
  if (state === 'disengagement') return '#f43f5e'; // rose
  if (state === 'recovery') return '#a855f7'; // purple
  return '#3b82f6'; // default blue
};

const CustomizedDot = (props) => {
  const { cx, cy, payload, r = 4 } = props;
  const color = getColorByState(payload.state);
  return (
    <circle 
      cx={cx} cy={cy} r={r} 
      stroke="#0f172a" strokeWidth={2} 
      fill={color} 
      style={{ filter: `drop-shadow(0 0 4px ${color})` }} 
    />
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const color = getColorByState(data.state);
    return (
      <div className="bg-[#0f172a]/95 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl shadow-2xl">
        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{data.date}</div>
        <div className="flex items-center gap-2 mt-0.5" style={{ color }}>
          <div className="text-xl font-black font-sora">{Math.round(data.momentum)}</div>
          <div className="text-[10px] uppercase font-bold tracking-widest leading-none">{data.state || 'Momentum'}</div>
        </div>
      </div>
    );
  }
  return null;
};

const RecoveryGraph = ({ data }) => {
  return (
    <div className="glass-card border-white/5 bg-white/[0.02]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-extrabold font-sora text-white">Recovery Pulse</h2>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1.5 opacity-60">
            Holographic Projection Phase
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Disengagement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">Recovery</span>
          </div>
        </div>
      </div>

      <div className="h-48 w-full mt-6" style={{ minHeight: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMomentum" x1="0" y1="0" x2="100%" y2="0">
                {data.map((d, index) => {
                  const offset = `${(index / (data.length - 1)) * 100}%`;
                  const color = getColorByState(d.state);
                  return <stop key={index} offset={offset} stopColor={color} />;
                })}
              </linearGradient>
              <linearGradient id="glowMomentum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#475569" stopOpacity={0.15}/>
                <stop offset="100%" stopColor="#475569" stopOpacity={0}/>
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
              domain={['dataMin - 10', 'dataMax + 10']}
              hide
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
            
            {/* Collective dotted line removed or faded? We'll leave it as back ground context */}
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
              stroke="url(#colorMomentum)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#glowMomentum)" 
              animationDuration={2500}
              dot={<CustomizedDot />}
              activeDot={<CustomizedDot r={7} />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RecoveryGraph;
