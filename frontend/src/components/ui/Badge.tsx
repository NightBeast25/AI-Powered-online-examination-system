import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    success: 'bg-[#DCFCE7] text-[#16A34A]',
    warning: 'bg-[#FEF9C3] text-[#CA8A04]',
    danger: 'bg-[#FEE2E2] text-[#DC2626]',
    info: 'bg-[#E0E7FF] text-[#4338CA]',
    default: 'bg-background text-textMuted'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
