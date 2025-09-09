// Colors for the app theme - minimal, clean, pastel colors
export const COLORS = {
  primary: '#4CAF50',      // Green
  secondary: '#2196F3',    // Blue  
  background: '#FFFFFF',   // White
  surface: '#F5F5F5',      // Light gray
  text: '#333333',         // Dark gray
  textSecondary: '#666666', // Medium gray
  textLight: '#999999',    // Light gray
  error: '#F44336',        // Red
  warning: '#FF9800',      // Orange
  success: '#4CAF50',      // Green
  accent: '#E8F5E8',       // Light green
  border: '#E0E0E0',       // Light border
};

// Activity levels for TDEE calculation
export const ACTIVITY_LEVELS = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTREMELY_ACTIVE: 1.9,
};

// Fitness goals
export const FITNESS_GOALS = {
  LOSE_WEIGHT: 'lose_weight',
  MAINTAIN_WEIGHT: 'maintain_weight',
  GAIN_WEIGHT: 'gain_weight',
  BUILD_MUSCLE: 'build_muscle',
};

// Meal types
export const MEAL_TYPES = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACKS: 'snacks',
};

// Nutrition targets (percentage of daily calories)
export const MACRO_TARGETS = {
  PROTEIN: 0.25,    // 25% of calories
  CARBS: 0.45,      // 45% of calories  
  FAT: 0.30,        // 30% of calories
};

// Screen names for navigation
export const SCREEN_NAMES = {
  // Auth screens
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // Onboarding screens
  ONBOARDING: 'Onboarding',
  PROFILE_SETUP: 'ProfileSetup',
  GOAL_SETUP: 'GoalSetup',
  
  // Main screens
  DASHBOARD: 'Dashboard',
  FOOD_LOGGING: 'FoodLogging',
  ANALYTICS: 'Analytics',
  PROFILE: 'Profile',
  
  // Food logging screens
  ADD_FOOD: 'AddFood',
  BARCODE_SCANNER: 'BarcodeScanner',
  PHOTO_FOOD: 'PhotoFood',
};

// API endpoints
export const API_ENDPOINTS = {
  OPENAI: 'https://api.openai.com/v1',
  NUTRITION_API: 'https://api.edamam.com/api/food-database/v2',
  BARCODE_API: 'https://world.openfoodfacts.org/api/v0',
};