import { useState, useCallback } from 'react';

export interface Workout {
  id: string;
  name: string;
  date: Date;
  exercises: any[];
}

export function useWorkout() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  const startWorkout = useCallback((name: string) => {
    setActiveWorkout({
      id: Date.now().toString(),
      name,
      date: new Date(),
      exercises: []
    });
  }, []);

  const endWorkout = useCallback(() => {
    if (activeWorkout) {
      setWorkouts(prev => [...prev, activeWorkout]);
      setActiveWorkout(null);
    }
  }, [activeWorkout]);

  return {
    workouts,
    activeWorkout,
    startWorkout,
    endWorkout
  };
}
