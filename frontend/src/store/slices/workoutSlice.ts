import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as workoutsApi from '../../api/workouts.api';

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
  type: 'normal' | 'warmup' | 'dropset';
  rpe?: number;
  rir?: number;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  notes?: string;
  restSeconds: number;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
  durationMinutes: number;
  completed: boolean;
  completedAt?: string;
}

interface WorkoutState {
  currentWorkout: Workout | null;
  history: Workout[];
  lastCompletedWorkout: Workout | null;
  summary: any | null;
  activeExerciseIndex: number;
  loading: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  currentWorkout: null,
  history: [],
  lastCompletedWorkout: null,
  summary: null,
  activeExerciseIndex: 0,
  loading: false,
  error: null,
};

export const fetchWorkouts = createAsyncThunk(
  'workout/fetchWorkouts',
  async () => {
    const response = await workoutsApi.getWorkouts();
    return response;
  }
);

export const saveWorkout = createAsyncThunk(
  'workout/saveWorkout',
  async (workoutData: Partial<Workout>) => {
    const response = await workoutsApi.createWorkout(workoutData);
    return response;
  }
);

export const completeWorkout = createAsyncThunk(
  'workout/completeWorkout',
  async ({ id, workoutData }: { id: string; workoutData: Partial<Workout> }) => {
    const response = await workoutsApi.updateWorkout(id, { ...workoutData, completed: true });
    return response;
  }
);

export const fetchRepeatLast = createAsyncThunk(
  'workout/fetchRepeatLast',
  async () => {
    const response = await workoutsApi.repeatLastWorkout();
    return response;
  }
);

export const fetchWorkoutSummary = createAsyncThunk(
  'workout/fetchWorkoutSummary',
  async () => {
    const response = await workoutsApi.getWorkoutSummary();
    return response;
  }
);

const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    startWorkout: (state, action: PayloadAction<Workout>) => {
      state.currentWorkout = action.payload;
      state.activeExerciseIndex = 0;
    },
    finishWorkout: (state) => {
      if (state.currentWorkout) {
        state.currentWorkout.completed = true;
        state.currentWorkout.completedAt = new Date().toISOString();
        state.history.push(state.currentWorkout);
        state.lastCompletedWorkout = state.currentWorkout;
        state.currentWorkout = null;
        state.activeExerciseIndex = 0;
      }
    },
    clearWorkout: (state) => {
      state.currentWorkout = null;
      state.activeExerciseIndex = 0;
    },
    addExercise: (state, action: PayloadAction<WorkoutExercise>) => {
      if (state.currentWorkout) {
        state.currentWorkout.exercises.push(action.payload);
      }
    },
    removeExercise: (state, action: PayloadAction<number>) => {
      if (state.currentWorkout) {
        state.currentWorkout.exercises.splice(action.payload, 1);
        if (state.activeExerciseIndex >= state.currentWorkout.exercises.length) {
          state.activeExerciseIndex = Math.max(0, state.currentWorkout.exercises.length - 1);
        }
      }
    },
    addSet: (state, action: PayloadAction<{ exerciseIndex: number; set: WorkoutSet }>) => {
      if (state.currentWorkout) {
        state.currentWorkout.exercises[action.payload.exerciseIndex].sets.push(action.payload.set);
      }
    },
    removeSet: (state, action: PayloadAction<{ exerciseIndex: number; setIndex: number }>) => {
      if (state.currentWorkout) {
        state.currentWorkout.exercises[action.payload.exerciseIndex].sets.splice(action.payload.setIndex, 1);
      }
    },
    updateSet: (state, action: PayloadAction<{ exerciseIndex: number; setIndex: number; updates: Partial<WorkoutSet> }>) => {
      if (state.currentWorkout) {
        const set = state.currentWorkout.exercises[action.payload.exerciseIndex].sets[action.payload.setIndex];
        Object.assign(set, action.payload.updates);
      }
    },
    setActiveExercise: (state, action: PayloadAction<number>) => {
      state.activeExerciseIndex = action.payload;
    },
    reorderExercises: (state, action: PayloadAction<WorkoutExercise[]>) => {
      if (state.currentWorkout) {
        state.currentWorkout.exercises = action.payload;
      }
    },
    updateExerciseNotes: (state, action: PayloadAction<{ exerciseIndex: number; notes: string }>) => {
      if (state.currentWorkout) {
        state.currentWorkout.exercises[action.payload.exerciseIndex].notes = action.payload.notes;
      }
    },
    updateExerciseRestSeconds: (state, action: PayloadAction<{ exerciseIndex: number; restSeconds: number }>) => {
      if (state.currentWorkout) {
        state.currentWorkout.exercises[action.payload.exerciseIndex].restSeconds = action.payload.restSeconds;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchWorkouts
      .addCase(fetchWorkouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch workouts';
      })
      // saveWorkout
      .addCase(saveWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveWorkout.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.completed) {
          state.history.push(action.payload);
          state.lastCompletedWorkout = action.payload;
          state.currentWorkout = null;
          state.activeExerciseIndex = 0;
        }
      })
      .addCase(saveWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save workout';
      })
      // completeWorkout
      .addCase(completeWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.history.push(action.payload);
        state.lastCompletedWorkout = action.payload;
        state.currentWorkout = null;
        state.activeExerciseIndex = 0;
      })
      .addCase(completeWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to complete workout';
      })
      // fetchRepeatLast
      .addCase(fetchRepeatLast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepeatLast.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkout = action.payload;
      })
      .addCase(fetchRepeatLast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch last workout';
      })
      // fetchWorkoutSummary
      .addCase(fetchWorkoutSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchWorkoutSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch summary';
      });
  },
});

export const {
  startWorkout,
  finishWorkout,
  addExercise,
  removeExercise,
  addSet,
  removeSet,
  updateSet,
  setActiveExercise,
  reorderExercises,
  updateExerciseNotes,
} = workoutSlice.actions;

export default workoutSlice.reducer;
