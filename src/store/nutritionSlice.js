import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  weeklyData: [],
  monthlyData: [],
  nutritionAnalysis: {
    deficiencies: [],
    recommendations: [],
  },
  aiSuggestions: [],
  mealPlan: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  },
  loading: false,
  error: null,
};

const nutritionSlice = createSlice({
  name: 'nutrition',
  initialState,
  reducers: {
    setWeeklyData: (state, action) => {
      state.weeklyData = action.payload;
    },
    setMonthlyData: (state, action) => {
      state.monthlyData = action.payload;
    },
    updateNutritionAnalysis: (state, action) => {
      state.nutritionAnalysis = action.payload;
    },
    setAiSuggestions: (state, action) => {
      state.aiSuggestions = action.payload;
    },
    updateMealPlan: (state, action) => {
      state.mealPlan = { ...state.mealPlan, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setWeeklyData, 
  setMonthlyData, 
  updateNutritionAnalysis, 
  setAiSuggestions, 
  updateMealPlan, 
  setLoading, 
  setError, 
  clearError 
} = nutritionSlice.actions;
export default nutritionSlice.reducer;