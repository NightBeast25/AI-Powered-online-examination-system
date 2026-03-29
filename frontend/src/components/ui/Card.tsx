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
      whileHover={hoverable ? { scale: 1.01, y: -2 } : {}}
      className={`bg-surface rounded-xl border border-border overflow-hidden transition-shadow ${hoverable ? 'hover:shadow-md cursor-pointer' : 'shadow-sm'} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
