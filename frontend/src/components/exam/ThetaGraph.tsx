import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface ThetaGraphProps {
  history: number[]; // Array of theta values over time
}

export const ThetaGraph: React.FC<ThetaGraphProps> = ({ history }) => {
  const data = history.map((theta, i) => ({ step: i + 1, theta: Math.max(0, Math.min(100, ((theta + 3) / 6) * 100)) }));

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-sm w-64 h-32">
      <div className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2 flex justify-between">
        <span>Ability Score</span>
        <span className="text-primary">{Math.round(data[data.length - 1]?.theta || 50)}</span>
      </div>
      <div className="h-16 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTheta" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F6AF5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4F6AF5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis domain={[0, 100]} hide />
            <XAxis dataKey="step" hide />
            <Area type="monotone" dataKey="theta" stroke="#4F6AF5" fillOpacity={1} fill="url(#colorTheta)" isAnimationActive={true} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
