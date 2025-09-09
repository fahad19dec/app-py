import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: {
    age: null,
    gender: null,
    weight: null,
    height: null,
    activityLevel: null,
    goal: null,
    dailyCalorieTarget: null,
  },
  preferences: {
    units: 'metric', // metric or imperial
    notifications: true,
    darkMode: false,
  },
  isOnboardingComplete: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setDailyCalorieTarget: (state, action) => {
      state.profile.dailyCalorieTarget = action.payload;
    },
    completeOnboarding: (state) => {
      state.isOnboardingComplete = true;
    },
    resetUser: (state) => {
      return initialState;
    },
  },
});

export const { 
  updateProfile, 
  updatePreferences, 
  setDailyCalorieTarget, 
  completeOnboarding, 
  resetUser 
} = userSlice.actions;
export default userSlice.reducer;