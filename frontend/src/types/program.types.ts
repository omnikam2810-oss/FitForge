import { Exercise } from './exercise.types';

export interface ProgramExercise {
  id: string;
  exercise: Exercise;
  targetSets: number;
  targetReps: string;
  targetRpe?: number;
  restSeconds?: number;
}

export interface ProgramDay {
  id: string;
  dayNumber: number;
  name: string;
  exercises: ProgramExercise[];
}

export interface ProgramWeek {
  id: string;
  weekNumber: number;
  days: ProgramDay[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  durationWeeks: number;
  weeks: ProgramWeek[];
  authorId: string;
  isPublic: boolean;
}
