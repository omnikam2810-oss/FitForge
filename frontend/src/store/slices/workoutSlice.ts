import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
  durationMinutes: number;
  completed: boolean;
}

interface WorkoutState {
  currentWorkout: Workout | null;
  history: Workout[];
  loading: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  currentWorkout: null,
  history: [],
  loading: false,
  error: null,
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    startWorkout: (state, action: PayloadAction<Workout>) => {
      state.currentWorkout = action.payload;
    },
    finishWorkout: (state) => {
      if (state.currentWorkout) {
        state.currentWorkout.completed = true;
        state.history.push(state.currentWorkout);
        state.currentWorkout = null;
      }
    },
    setWorkoutHistory: (state, action: PayloadAction<Workout[]>) => {
      state.history = action.payload;
    },
    setWorkoutLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setWorkoutError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { startWorkout, finishWorkout, setWorkoutHistory, setWorkoutLoading, setWorkoutError } = workoutSlice.actions;
export default workoutSlice.reducer;
