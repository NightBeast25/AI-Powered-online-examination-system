import React from 'react';
import { motion } from 'framer-motion';

interface DifficultyMeterProps {
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

export const DifficultyMeter: React.FC<DifficultyMeterProps> = ({ difficultyLevel }) => {
  const settings = {
    easy: { width: '33%', color: 'var(--color-success, #22C55E)' },
    medium: { width: '66%', color: 'var(--color-warning, #F59E0B)' },
    hard: { width: '100%', color: 'var(--color-danger, #EF4444)' }
  };

  const { width, color } = settings[difficultyLevel] || settings.medium;

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-sm w-48">
      <div className="text-xs font-semibold text-textMuted uppercase tracking-wider mb-2">Question Difficulty</div>
      <div className="h-2 bg-background rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width, backgroundColor: color }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="h-full rounded-full"
        />
      </div>
      <div className="mt-2 text-right text-sm font-medium capitalize" style={{ color }}>
        {difficultyLevel}
      </div>
    </div>
  );
};
