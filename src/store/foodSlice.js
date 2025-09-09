import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dailyEntries: [], // Array of food entries for today
  foodHistory: [], // Historical food entries
  todayStats: {
    totalCalories: 0,
    macros: {
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
    },
    mealBreakdown: {
      breakfast: { calories: 0, items: [] },
      lunch: { calories: 0, items: [] },
      dinner: { calories: 0, items: [] },
      snacks: { calories: 0, items: [] },
    },
  },
  loading: false,
  error: null,
};

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    addFoodEntry: (state, action) => {
      const entry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.dailyEntries.push(entry);
      
      // Update today's stats
      state.todayStats.totalCalories += entry.calories;
      if (entry.macros) {
        state.todayStats.macros.protein += entry.macros.protein || 0;
        state.todayStats.macros.carbs += entry.macros.carbs || 0;
        state.todayStats.macros.fat += entry.macros.fat || 0;
        state.todayStats.macros.fiber += entry.macros.fiber || 0;
        state.todayStats.macros.sugar += entry.macros.sugar || 0;
      }
      
      // Update meal breakdown
      const mealType = entry.mealType || 'snacks';
      state.todayStats.mealBreakdown[mealType].calories += entry.calories;
      state.todayStats.mealBreakdown[mealType].items.push(entry);
    },
    removeFoodEntry: (state, action) => {
      const entryId = action.payload;
      const entryIndex = state.dailyEntries.findIndex(entry => entry.id === entryId);
      
      if (entryIndex !== -1) {
        const entry = state.dailyEntries[entryIndex];
        
        // Update today's stats
        state.todayStats.totalCalories -= entry.calories;
        if (entry.macros) {
          state.todayStats.macros.protein -= entry.macros.protein || 0;
          state.todayStats.macros.carbs -= entry.macros.carbs || 0;
          state.todayStats.macros.fat -= entry.macros.fat || 0;
          state.todayStats.macros.fiber -= entry.macros.fiber || 0;
          state.todayStats.macros.sugar -= entry.macros.sugar || 0;
        }
        
        // Update meal breakdown
        const mealType = entry.mealType || 'snacks';
        state.todayStats.mealBreakdown[mealType].calories -= entry.calories;
        const itemIndex = state.todayStats.mealBreakdown[mealType].items.findIndex(item => item.id === entryId);
        if (itemIndex !== -1) {
          state.todayStats.mealBreakdown[mealType].items.splice(itemIndex, 1);
        }
        
        state.dailyEntries.splice(entryIndex, 1);
      }
    },
    clearDailyEntries: (state) => {
      state.dailyEntries = [];
      state.todayStats = initialState.todayStats;
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
  addFoodEntry, 
  removeFoodEntry, 
  clearDailyEntries, 
  setLoading, 
  setError, 
  clearError 
} = foodSlice.actions;
export default foodSlice.reducer;