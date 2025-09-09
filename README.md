# CalCount - AI-Powered Nutrition Tracking App

CalCount is a comprehensive React Native application built with Expo that helps users track their nutrition and calories using AI-powered food recognition, barcode scanning, and intelligent recommendations.

## Features

### 🏃‍♂️ Onboarding & Profile Setup
- User inputs age, gender, weight, height, activity level, and fitness goals
- Automatic TDEE (Total Daily Energy Expenditure) calculation
- Personalized daily calorie target based on fitness goals

### 🍎 Food Logging
- **Text Input**: Describe your food and get AI-powered nutrition analysis
- **Photo Analysis**: Take photos of food for instant calorie estimates using OpenAI Vision API
- **Barcode Scanner**: Scan product barcodes for accurate nutrition information
- **Manual Entry**: Quick food database search and manual input

### 📊 Dashboard & Analytics
- Daily calories consumed vs remaining with visual progress bars
- Comprehensive macro breakdown (protein, carbs, fat, fiber, sugar)
- Meal-wise tracking (breakfast, lunch, dinner, snacks)
- Weekly and monthly nutrition charts
- AI-powered nutrition insights and deficiency detection
- Progress tracking and goal monitoring

### 🤖 AI-Powered Features
- OpenAI integration for food description analysis
- Computer vision for food photo recognition
- Personalized meal suggestions and healthier alternatives
- Smart portion size recommendations

### 🔒 Security & Data
- Firebase Authentication (email, Google, Apple login support)
- Secure API key handling with environment variables
- Local SQLite storage with cloud sync capability
- Encrypted storage for sensitive data

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: JavaScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Database**: SQLite (local) + Firebase/Firestore (cloud sync)
- **Authentication**: Firebase Auth
- **Charts**: Victory Native
- **UI**: Custom components with clean, minimal design

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd app-py
npm install
```

### 2. Environment Configuration
Copy the example environment file and configure your API keys:
```bash
cp .env.example .env
```

Edit `.env` file with your actual API keys:
```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# Nutrition API Configuration (Edamam)
NUTRITION_API_KEY=your_nutrition_api_key
NUTRITION_APP_ID=your_nutrition_app_id
```

### 3. Firebase Setup
1. Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication and Firestore Database
3. Add your app configuration to the `.env` file

### 4. OpenAI Setup
1. Get an API key from [https://platform.openai.com](https://platform.openai.com)
2. Add the key to your `.env` file

### 5. Run the Application

For development:
```bash
# Start the development server
npm start

# Run on specific platforms
npm run android  # Android device/emulator
npm run ios      # iOS simulator (macOS only)
npm run web      # Web browser
```

For production build:
```bash
# Build for production
expo build:android
expo build:ios
```

## Demo Mode

The app includes mock data and services that work without API keys for demonstration purposes. When API keys are not configured, the app will:
- Use mock food analysis data
- Simulate barcode scanning results
- Provide example nutrition recommendations
- Show sample charts and analytics

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.js
│   ├── Input.js
│   └── Cards.js
├── constants/           # App constants and themes
│   └── index.js
├── navigation/          # Navigation configuration
│   └── AppNavigator.js
├── screens/            # Application screens
│   ├── LoginScreen.js
│   ├── OnboardingScreen.js
│   ├── ProfileSetupScreen.js
│   ├── DashboardScreen.js
│   ├── FoodLoggingScreen.js
│   ├── AddFoodScreen.js
│   ├── BarcodeScannerScreen.js
│   ├── PhotoFoodScreen.js
│   ├── AnalyticsScreen.js
│   └── ProfileScreen.js
├── services/           # External API integrations
│   ├── firebase.js
│   ├── openai.js
│   └── nutrition.js
├── store/             # Redux store and slices
│   ├── index.js
│   ├── authSlice.js
│   ├── userSlice.js
│   ├── foodSlice.js
│   └── nutritionSlice.js
└── utils/             # Utility functions
    └── calculations.js
```

## API Integrations

### OpenAI API
- **Text Analysis**: Converts food descriptions to structured nutrition data
- **Vision API**: Analyzes food photos for calorie estimation
- **Meal Planning**: Generates personalized meal suggestions

### Nutrition APIs
- **Edamam Food Database**: Comprehensive food nutrition lookup
- **OpenFoodFacts**: Free barcode-based product information
- **USDA Food Data**: Government nutrition database integration

### Firebase Services
- **Authentication**: User signup/login with multiple providers
- **Firestore**: Cloud data synchronization
- **Storage**: User profile and food images

## Features Roadmap

### Completed ✅
- User authentication and onboarding
- Profile setup with TDEE calculation
- Food logging with multiple input methods
- Dashboard with calorie and macro tracking
- Analytics with charts and insights
- AI-powered food analysis
- Barcode scanning functionality
- Photo food recognition

### In Development 🚧
- Social features and friend connections
- Gamification with streaks and achievements
- Advanced meal planning with shopping lists
- Nutritionist consultation integration
- Wearable device synchronization

### Planned 📋
- Offline mode support
- Recipe builder and import
- Restaurant menu integration
- Nutrition coaching features
- Premium subscription features

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@calcount.app or join our Discord community.

---

**Note**: This app requires API keys for full functionality. Demo mode is available for testing without external service dependencies.