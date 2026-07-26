import { Exercise } from './exercise.types';

export enum SetType {
  Warmup = 'Warmup',
  Normal = 'Normal',
  DropSet = 'DropSet',
  Failure = 'Failure',
}

export enum Mood {
  Great = 'Great',
  Good = 'Good',
  Okay = 'Okay',
  Tired = 'Tired',
  Exhausted = 'Exhausted',
}

export interface Set {
  id: string;
  type: SetType;
  reps: number;
  weight: number;
  rpe?: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  startTime?: string;
  endTime?: string;
  exercises: WorkoutExercise[];
  mood?: Mood;
  notes?: string;
  volume: number;
}
