import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverable = false }) => {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.015, y: -4 } : {}}
      className={`bg-surface rounded-xl border border-white/5 overflow-hidden transition-all duration-300 ${hoverable ? 'hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 cursor-pointer' : 'shadow-xl shadow-black/10'} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
