import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

interface ExerciseState {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
}

const initialState: ExerciseState = {
  exercises: [],
  loading: false,
  error: null,
};

const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
    setExercises: (state, action: PayloadAction<Exercise[]>) => {
      state.exercises = action.payload;
      state.loading = false;
    },
    setExerciseLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setExerciseError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setExercises, setExerciseLoading, setExerciseError } = exerciseSlice.actions;
export default exerciseSlice.reducer;
