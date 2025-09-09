import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import userSlice from './userSlice';
import foodSlice from './foodSlice';
import nutritionSlice from './nutritionSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    food: foodSlice,
    nutrition: nutritionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;