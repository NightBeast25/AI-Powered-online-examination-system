import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-[60px] bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <span className="font-semibold text-lg text-textPrimary tracking-tight">AdaptiveExam</span>
      </div>
      
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary">
              <UserIcon size={16} />
            </div>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <button 
            onClick={logout}
            className="text-textMuted hover:text-danger transition-colors p-2"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </header>
  );
};
