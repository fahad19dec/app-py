import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

class OpenAIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = API_ENDPOINTS.OPENAI;
  }

  async analyzeFoodDescription(description) {
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      // Return mock data for demo
      return this.getMockFoodAnalysis(description);
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a nutrition expert. Analyze the food description and return a JSON object with the following structure:
              {
                "foodItems": [
                  {
                    "name": "food name",
                    "quantity": "amount with unit",
                    "calories": number,
                    "macros": {
                      "protein": number_in_grams,
                      "carbs": number_in_grams,
                      "fat": number_in_grams,
                      "fiber": number_in_grams,
                      "sugar": number_in_grams
                    }
                  }
                ],
                "totalCalories": number,
                "confidence": number_between_0_and_1
              }`
            },
            {
              role: 'user',
              content: `Analyze this food description: "${description}"`
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.getMockFoodAnalysis(description);
    }
  }

  async analyzeFoodImage(imageBase64) {
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      // Return mock data for demo
      return this.getMockFoodAnalysis('food from image');
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'system',
              content: `You are a nutrition expert. Analyze the food image and return a JSON object with the following structure:
              {
                "foodItems": [
                  {
                    "name": "food name",
                    "quantity": "estimated amount with unit",
                    "calories": number,
                    "macros": {
                      "protein": number_in_grams,
                      "carbs": number_in_grams,
                      "fat": number_in_grams,
                      "fiber": number_in_grams,
                      "sugar": number_in_grams
                    }
                  }
                ],
                "totalCalories": number,
                "confidence": number_between_0_and_1
              }`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this food image and estimate the nutritional content:'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI Vision API error:', error);
      return this.getMockFoodAnalysis('food from image');
    }
  }

  async generateMealSuggestions(userProfile, preferences = []) {
    if (!this.apiKey || this.apiKey === 'your_openai_api_key_here') {
      return this.getMockMealSuggestions();
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a nutrition expert and meal planner. Generate meal suggestions based on the user's profile and preferences.`
            },
            {
              role: 'user',
              content: `Generate 3 meal suggestions for a user with daily calorie target: ${userProfile.dailyCalorieTarget}, goal: ${userProfile.goal}, preferences: ${preferences.join(', ')}. Return as JSON array with name, calories, and brief description.`
            }
          ],
          temperature: 0.7,
          max_tokens: 400
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI meal suggestions error:', error);
      return this.getMockMealSuggestions();
    }
  }

  // Mock data for demo purposes
  getMockFoodAnalysis(description) {
    const mockResponses = {
      'chicken breast': {
        foodItems: [
          {
            name: 'Chicken Breast',
            quantity: '100g',
            calories: 165,
            macros: {
              protein: 31,
              carbs: 0,
              fat: 3.6,
              fiber: 0,
              sugar: 0
            }
          }
        ],
        totalCalories: 165,
        confidence: 0.9
      },
      'banana': {
        foodItems: [
          {
            name: 'Banana',
            quantity: '1 medium',
            calories: 105,
            macros: {
              protein: 1.3,
              carbs: 27,
              fat: 0.4,
              fiber: 3.1,
              sugar: 14.4
            }
          }
        ],
        totalCalories: 105,
        confidence: 0.95
      }
    };

    // Return a mock response based on description or default
    const lowerDesc = description.toLowerCase();
    for (const [key, value] of Object.entries(mockResponses)) {
      if (lowerDesc.includes(key)) {
        return value;
      }
    }

    // Default mock response
    return {
      foodItems: [
        {
          name: 'Mixed Food',
          quantity: '1 serving',
          calories: 250,
          macros: {
            protein: 15,
            carbs: 30,
            fat: 8,
            fiber: 5,
            sugar: 10
          }
        }
      ],
      totalCalories: 250,
      confidence: 0.7
    };
  }

  getMockMealSuggestions() {
    return [
      {
        name: 'Grilled Chicken Salad',
        calories: 350,
        description: 'Mixed greens with grilled chicken, vegetables, and light dressing'
      },
      {
        name: 'Quinoa Buddha Bowl',
        calories: 420,
        description: 'Quinoa with roasted vegetables, chickpeas, and tahini dressing'
      },
      {
        name: 'Salmon with Sweet Potato',
        calories: 480,
        description: 'Baked salmon with roasted sweet potato and steamed broccoli'
      }
    ];
  }
}

export default new OpenAIService();