import React from 'react';
import { motion } from 'framer-motion';

interface TimerBarProps {
  progress: number; // 0 to 100
  minutes: number;
  seconds: number;
}

export const TimerBar: React.FC<TimerBarProps> = ({ progress, minutes, seconds }) => {
  const isWarning = progress < 20;
  const isCritical = progress < 5;
  
  const color = isCritical ? 'bg-danger' : isWarning ? 'bg-warning' : 'bg-primary';

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1.5 w-full bg-background">
        <motion.div
          className={`h-full ${color}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: 'linear', duration: 1 }}
        />
      </div>
      <div className="absolute top-4 right-6 bg-surface shadow-sm border border-border px-4 py-2 rounded-full font-mono text-lg font-medium flex items-center gap-2">
        <svg className={`w-5 h-5 ${isCritical ? 'text-danger animate-pulse' : 'text-textMuted'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className={isCritical ? 'text-danger' : 'text-textPrimary'}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
