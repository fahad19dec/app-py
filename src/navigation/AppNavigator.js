import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FoodLoggingScreen from '../screens/FoodLoggingScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddFoodScreen from '../screens/AddFoodScreen';
import BarcodeScannerScreen from '../screens/BarcodeScannerScreen';
import PhotoFoodScreen from '../screens/PhotoFoodScreen';

import { COLORS, SCREEN_NAMES } from '../constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === SCREEN_NAMES.DASHBOARD) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === SCREEN_NAMES.FOOD_LOGGING) {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === SCREEN_NAMES.ANALYTICS) {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          } else if (route.name === SCREEN_NAMES.PROFILE) {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
        },
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.background,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name={SCREEN_NAMES.DASHBOARD} 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.FOOD_LOGGING} 
        component={FoodLoggingScreen}
        options={{ title: 'Log Food' }}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.ANALYTICS} 
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      <Tab.Screen 
        name={SCREEN_NAMES.PROFILE} 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const { isOnboardingComplete } = useSelector(state => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.background,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {!isAuthenticated ? (
          <Stack.Screen 
            name={SCREEN_NAMES.LOGIN} 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : !isOnboardingComplete ? (
          <>
            <Stack.Screen 
              name={SCREEN_NAMES.ONBOARDING} 
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name={SCREEN_NAMES.PROFILE_SETUP} 
              component={ProfileSetupScreen}
              options={{ title: 'Setup Profile' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name={SCREEN_NAMES.ADD_FOOD} 
              component={AddFoodScreen}
              options={{ title: 'Add Food', presentation: 'modal' }}
            />
            <Stack.Screen 
              name={SCREEN_NAMES.BARCODE_SCANNER} 
              component={BarcodeScannerScreen}
              options={{ title: 'Scan Barcode', presentation: 'modal' }}
            />
            <Stack.Screen 
              name={SCREEN_NAMES.PHOTO_FOOD} 
              component={PhotoFoodScreen}
              options={{ title: 'Photo Analysis', presentation: 'modal' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;