import { ACTIVITY_LEVELS, FITNESS_GOALS } from '../constants';

// Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
export const calculateBMR = (weight, height, age, gender) => {
  // weight in kg, height in cm, age in years
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Calculate Total Daily Energy Expenditure (TDEE)
export const calculateTDEE = (bmr, activityLevel) => {
  return bmr * ACTIVITY_LEVELS[activityLevel];
};

// Calculate daily calorie target based on goal
export const calculateDailyCalorieTarget = (tdee, goal) => {
  switch (goal) {
    case FITNESS_GOALS.LOSE_WEIGHT:
      return Math.round(tdee - 500); // 500 calorie deficit for 1 lb/week loss
    case FITNESS_GOALS.GAIN_WEIGHT:
      return Math.round(tdee + 500); // 500 calorie surplus for 1 lb/week gain
    case FITNESS_GOALS.BUILD_MUSCLE:
      return Math.round(tdee + 300); // Moderate surplus for muscle building
    case FITNESS_GOALS.MAINTAIN_WEIGHT:
    default:
      return Math.round(tdee);
  }
};

// Convert between metric and imperial units
export const convertWeight = (weight, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return weight;
  
  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return weight * 2.20462;
  } else if (fromUnit === 'lbs' && toUnit === 'kg') {
    return weight / 2.20462;
  }
  return weight;
};

export const convertHeight = (height, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return height;
  
  if (fromUnit === 'cm' && toUnit === 'ft') {
    const totalInches = height / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  } else if (fromUnit === 'ft' && toUnit === 'cm') {
    const totalInches = height.feet * 12 + height.inches;
    return totalInches * 2.54;
  }
  return height;
};

// Format numbers for display
export const formatCalories = (calories) => {
  return Math.round(calories).toString();
};

export const formatMacros = (grams) => {
  return Math.round(grams * 10) / 10; // Round to 1 decimal place
};

// Calculate macro calories
export const calculateMacroCalories = (macros) => {
  return {
    proteinCalories: macros.protein * 4,
    carbCalories: macros.carbs * 4, 
    fatCalories: macros.fat * 9,
  };
};

// Validate user input
export const validateAge = (age) => {
  return age >= 13 && age <= 120;
};

export const validateWeight = (weight, unit) => {
  if (unit === 'kg') {
    return weight >= 30 && weight <= 300; // 30-300 kg
  } else {
    return weight >= 66 && weight <= 660; // 66-660 lbs
  }
};

export const validateHeight = (height, unit) => {
  if (unit === 'cm') {
    return height >= 100 && height <= 250; // 100-250 cm
  } else {
    return height.feet >= 3 && height.feet <= 8; // 3-8 feet
  }
};

// Date utilities
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const getWeekStart = (date = new Date()) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day;
  return new Date(start.setDate(diff));
};

export const getMonthStart = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};