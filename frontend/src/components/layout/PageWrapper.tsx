import React from 'react';
import { motion } from 'framer-motion';

export const PageWrapper: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-6 max-w-7xl mx-auto w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};
