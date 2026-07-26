import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Subscription {
  id: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  plan: 'free' | 'pro' | 'elite';
  currentPeriodEnd: string;
}

interface SubscriptionState {
  data: Subscription | null;
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  data: null,
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      state.data = action.payload;
    },
    setSubscriptionLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSubscriptionError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setSubscription, setSubscriptionLoading, setSubscriptionError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
