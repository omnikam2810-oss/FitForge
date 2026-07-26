import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Measurement {
  id: string;
  date: string;
  weight: number;
  bodyFatPercentage?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  thighs?: number;
}

interface ProgressState {
  measurements: Measurement[];
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  measurements: [],
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    setMeasurements: (state, action: PayloadAction<Measurement[]>) => {
      state.measurements = action.payload;
    },
    addMeasurement: (state, action: PayloadAction<Measurement>) => {
      state.measurements.push(action.payload);
    },
    setProgressLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProgressError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setMeasurements, addMeasurement, setProgressLoading, setProgressError } = progressSlice.actions;
export default progressSlice.reducer;
