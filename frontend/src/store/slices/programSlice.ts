import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Program {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  workoutsPerWeek: number;
  thumbnailUrl?: string;
}

interface ProgramState {
  availablePrograms: Program[];
  activeProgram: Program | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProgramState = {
  availablePrograms: [],
  activeProgram: null,
  loading: false,
  error: null,
};

const programSlice = createSlice({
  name: 'program',
  initialState,
  reducers: {
    setAvailablePrograms: (state, action: PayloadAction<Program[]>) => {
      state.availablePrograms = action.payload;
    },
    setActiveProgram: (state, action: PayloadAction<Program>) => {
      state.activeProgram = action.payload;
    },
    setProgramLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProgramError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setAvailablePrograms, setActiveProgram, setProgramLoading, setProgramError } = programSlice.actions;
export default programSlice.reducer;
