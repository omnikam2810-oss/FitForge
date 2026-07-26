import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import exerciseReducer from './slices/exerciseSlice';
import workoutReducer from './slices/workoutSlice';
import programReducer from './slices/programSlice';
import progressReducer from './slices/progressSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    exercise: exerciseReducer,
    workout: workoutReducer,
    program: programReducer,
    progress: progressReducer,
    subscription: subscriptionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
