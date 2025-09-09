import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

class NutritionService {
  constructor() {
    this.edamamApiKey = process.env.NUTRITION_API_KEY;
    this.edamamAppId = process.env.NUTRITION_APP_ID;
  }

  async searchFood(query) {
    if (!this.edamamApiKey || this.edamamApiKey === 'your_nutrition_api_key') {
      // Return mock data for demo
      return this.getMockSearchResults(query);
    }

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.NUTRITION_API}/parser`,
        {
          params: {
            app_id: this.edamamAppId,
            app_key: this.edamamApiKey,
            ingr: query,
          },
        }
      );

      return this.formatEdamamResponse(response.data);
    } catch (error) {
      console.error('Nutrition API error:', error);
      return this.getMockSearchResults(query);
    }
  }

  async getFoodDetails(foodId) {
    if (!this.edamamApiKey || this.edamamApiKey === 'your_nutrition_api_key') {
      return this.getMockFoodDetails(foodId);
    }

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.NUTRITION_API}/nutrients`,
        {
          params: {
            app_id: this.edamamAppId,
            app_key: this.edamamApiKey,
          },
          data: {
            ingredients: [
              {
                quantity: 1,
                measureURI: 'http://www.edamam.com/ontologies/edamam.owl#Measure_unit',
                foodId: foodId,
              },
            ],
          },
        }
      );

      return this.formatNutrientResponse(response.data);
    } catch (error) {
      console.error('Nutrition details API error:', error);
      return this.getMockFoodDetails(foodId);
    }
  }

  async searchByBarcode(barcode) {
    try {
      // Use OpenFoodFacts API for barcode lookup (free and open)
      const response = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );

      if (response.data.status === 1) {
        return this.formatOpenFoodFactsResponse(response.data.product);
      } else {
        return null;
      }
    } catch (error) {
      console.error('Barcode API error:', error);
      return null;
    }
  }

  formatEdamamResponse(data) {
    return data.parsed?.map(item => ({
      id: item.food.foodId,
      name: item.food.label,
      calories: Math.round(item.food.nutrients?.ENERC_KCAL || 0),
      macros: {
        protein: Math.round(item.food.nutrients?.PROCNT || 0),
        carbs: Math.round(item.food.nutrients?.CHOCDF || 0),
        fat: Math.round(item.food.nutrients?.FAT || 0),
        fiber: Math.round(item.food.nutrients?.FIBTG || 0),
        sugar: Math.round(item.food.nutrients?.SUGAR || 0),
      },
      quantity: '100g',
      source: 'edamam',
    })) || [];
  }

  formatOpenFoodFactsResponse(product) {
    const nutriments = product.nutriments || {};
    
    return {
      id: product.code,
      name: product.product_name || 'Unknown Product',
      calories: Math.round(nutriments.energy_kcal_100g || nutriments['energy-kcal_100g'] || 0),
      macros: {
        protein: Math.round(nutriments.proteins_100g || 0),
        carbs: Math.round(nutriments.carbohydrates_100g || 0),
        fat: Math.round(nutriments.fat_100g || 0),
        fiber: Math.round(nutriments.fiber_100g || 0),
        sugar: Math.round(nutriments.sugars_100g || 0),
      },
      quantity: '100g',
      source: 'openfoodfacts',
      brand: product.brands,
      image: product.image_url,
    };
  }

  // Mock data for demo purposes
  getMockSearchResults(query) {
    const mockDatabase = {
      apple: [
        {
          id: 'apple_1',
          name: 'Apple, raw',
          calories: 52,
          macros: { protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10 },
          quantity: '100g',
          source: 'mock',
        },
      ],
      banana: [
        {
          id: 'banana_1',
          name: 'Banana, raw',
          calories: 89,
          macros: { protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12 },
          quantity: '100g',
          source: 'mock',
        },
      ],
      chicken: [
        {
          id: 'chicken_1',
          name: 'Chicken breast, grilled',
          calories: 165,
          macros: { protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 },
          quantity: '100g',
          source: 'mock',
        },
      ],
      rice: [
        {
          id: 'rice_1',
          name: 'Rice, white, cooked',
          calories: 130,
          macros: { protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1 },
          quantity: '100g',
          source: 'mock',
        },
      ],
      bread: [
        {
          id: 'bread_1',
          name: 'Bread, white, slice',
          calories: 75,
          macros: { protein: 2.3, carbs: 14, fat: 1, fiber: 0.8, sugar: 1.5 },
          quantity: '1 slice (25g)',
          source: 'mock',
        },
      ],
      egg: [
        {
          id: 'egg_1',
          name: 'Egg, whole, cooked',
          calories: 155,
          macros: { protein: 13, carbs: 1.1, fat: 11, fiber: 0, sugar: 1.1 },
          quantity: '100g',
          source: 'mock',
        },
      ],
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, items] of Object.entries(mockDatabase)) {
      if (lowerQuery.includes(key)) {
        return items;
      }
    }

    // Default mock result
    return [
      {
        id: 'generic_food',
        name: `${query} (estimated)`,
        calories: 200,
        macros: { protein: 8, carbs: 25, fat: 8, fiber: 3, sugar: 5 },
        quantity: '100g',
        source: 'mock',
      },
    ];
  }

  getMockFoodDetails(foodId) {
    return {
      id: foodId,
      name: 'Mock Food Item',
      calories: 150,
      macros: { protein: 10, carbs: 20, fat: 5, fiber: 3, sugar: 8 },
      quantity: '100g',
      nutrients: {
        vitamins: { A: 5, C: 10, D: 0 },
        minerals: { calcium: 50, iron: 2, potassium: 200 },
      },
      source: 'mock',
    };
  }

  // Nutrition analysis helpers
  analyzeNutritionDeficiencies(weeklyData, userProfile) {
    const deficiencies = [];
    const recommendations = [];

    // Calculate averages
    const avgCalories = weeklyData.reduce((sum, day) => sum + day.calories, 0) / weeklyData.length;
    const avgProtein = weeklyData.reduce((sum, day) => sum + day.protein, 0) / weeklyData.length;
    const avgFiber = weeklyData.reduce((sum, day) => sum + day.fiber, 0) / weeklyData.length;

    // Check for common deficiencies
    if (avgProtein < userProfile.dailyCalorieTarget * 0.15 / 4) {
      deficiencies.push('Low protein intake');
      recommendations.push('Add lean meats, legumes, or protein powder to your meals');
    }

    if (avgFiber < 25) {
      deficiencies.push('Low fiber intake');
      recommendations.push('Include more fruits, vegetables, and whole grains');
    }

    if (avgCalories < userProfile.dailyCalorieTarget * 0.8) {
      deficiencies.push('Low calorie intake');
      recommendations.push('Make sure to eat enough to support your activity level');
    }

    return { deficiencies, recommendations };
  }
}

export default new NutritionService();