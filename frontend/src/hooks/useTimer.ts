import { useState, useEffect } from 'react';

export const useTimer = (initialMinutes: number, onExpire: () => void) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  return {
    timeLeft,
    minutes: Math.floor(timeLeft / 60),
    seconds: timeLeft % 60,
    progress: (timeLeft / (initialMinutes * 60)) * 100
  };
};
