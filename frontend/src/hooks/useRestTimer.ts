import { useState, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';

export function useRestTimer() {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const startTimer = useCallback((seconds: number) => {
    setTimeRemaining(seconds);
    setIsActive(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    setTimeRemaining(0);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          if (prev <= 4) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining]);

  return {
    isActive,
    timeRemaining,
    startTimer,
    stopTimer
  };
}
