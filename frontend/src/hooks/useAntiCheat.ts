import { useEffect, useRef } from 'react';
import { logEvent } from '../api/behavior';
import { useExamStore } from '../store/examStore';
import toast from 'react-hot-toast';

export const useAntiCheat = () => {
  const sessionId = useExamStore(s => s.sessionId);
  const blurCount = useRef(0);

  useEffect(() => {
    if (!sessionId) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logEvent(sessionId, 'tab_switch');
        toast.error('Warning: Tab switching is strictly prohibited!');
      }
    };

    const handleBlur = () => {
      blurCount.current += 1;
      logEvent(sessionId, 'window_blur', { count: blurCount.current });
      toast.error('Warning: Focus lost. Return to the exam window!');
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logEvent(sessionId, 'copy_attempt');
      toast.error('Warning: Copying is prohibited!');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logEvent(sessionId, 'right_click');
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logEvent(sessionId, 'fullscreen_exit');
        toast.error('Warning: You have exited full-screen mode!');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [sessionId]);
};
