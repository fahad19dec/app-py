import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Button from '../components/Button';
import Input from '../components/Input';
import { Card } from '../components/Cards';
import { addFoodEntry } from '../store/foodSlice';
import openAIService from '../services/openai';
import { COLORS, MEAL_TYPES } from '../constants';

const AddFoodScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  
  const { mealType = 'snacks', mode = 'search' } = route.params || {};
  
  const [foodDescription, setFoodDescription] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(mealType);

  const handleSearch = async () => {
    if (!foodDescription.trim()) {
      Alert.alert('Error', 'Please enter a food description');
      return;
    }

    setLoading(true);
    try {
      const result = await openAIService.analyzeFoodDescription(foodDescription);
      setSearchResults(result.foodItems || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze food. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = (foodItem) => {
    const entry = {
      ...foodItem,
      mealType: selectedMealType,
      description: foodDescription,
      timestamp: new Date().toISOString(),
    };

    dispatch(addFoodEntry(entry));
    
    Alert.alert(
      'Food Added!',
      `${foodItem.name} has been added to your ${selectedMealType}.`,
      [
        {
          text: 'Add Another',
          onPress: () => {
            setFoodDescription('');
            setSearchResults([]);
          },
        },
        {
          text: 'Done',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const MealTypeSelector = () => (
    <Card title="Meal Type">
      <View style={styles.mealTypeGrid}>
        {Object.entries(MEAL_TYPES).map(([key, value]) => (
          <Button
            key={key}
            title={key.charAt(0) + key.slice(1).toLowerCase()}
            onPress={() => setSelectedMealType(value)}
            variant={selectedMealType === value ? 'primary' : 'outline'}
            style={styles.mealTypeButton}
          />
        ))}
      </View>
    </Card>
  );

  const SearchResults = () => (
    searchResults.length > 0 && (
      <Card title="Found Foods">
        {searchResults.map((item, index) => (
          <View key={index} style={styles.resultItem}>
            <View style={styles.resultContent}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultQuantity}>{item.quantity}</Text>
              <View style={styles.resultNutrition}>
                <Text style={styles.resultCalories}>{Math.round(item.calories)} cal</Text>
                <Text style={styles.resultMacros}>
                  P: {Math.round(item.macros?.protein || 0)}g • 
                  C: {Math.round(item.macros?.carbs || 0)}g • 
                  F: {Math.round(item.macros?.fat || 0)}g
                </Text>
              </View>
            </View>
            <Button
              title="Add"
              onPress={() => handleAddFood(item)}
              style={styles.addButton}
            />
          </View>
        ))}
      </Card>
    )
  );

  const QuickSuggestions = () => (
    <Card title="Quick Suggestions">
      <View style={styles.suggestionsGrid}>
        {['Apple', 'Banana', 'Chicken breast', 'Rice', 'Bread slice', 'Egg'].map((suggestion) => (
          <Button
            key={suggestion}
            title={suggestion}
            onPress={() => setFoodDescription(suggestion)}
            variant="outline"
            style={styles.suggestionButton}
          />
        ))}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <MealTypeSelector />

          <Card title={mode === 'manual' ? 'Describe Your Food' : 'Search Foods'}>
            <Input
              label={mode === 'manual' ? 'Food Description' : 'Search'}
              value={foodDescription}
              onChangeText={setFoodDescription}
              placeholder={
                mode === 'manual' 
                  ? 'e.g., 1 cup cooked rice with chicken'
                  : 'e.g., apple, chicken breast, quinoa salad'
              }
              multiline={mode === 'manual'}
              autoCapitalize="none"
            />
            
            <Button
              title={mode === 'manual' ? 'Analyze Food' : 'Search'}
              onPress={handleSearch}
              loading={loading}
              style={styles.searchButton}
            />
          </Card>

          <SearchResults />

          {searchResults.length === 0 && <QuickSuggestions />}

          <Card title="Tips" style={styles.tipsCard}>
            <Text style={styles.tipText}>
              • Be specific about portions (e.g., "1 medium banana" vs "banana")
            </Text>
            <Text style={styles.tipText}>
              • Include cooking methods (e.g., "grilled chicken" vs "chicken")
            </Text>
            <Text style={styles.tipText}>
              • For mixed dishes, describe all main ingredients
            </Text>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mealTypeButton: {
    width: '48%',
    marginBottom: 8,
  },
  searchButton: {
    marginTop: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  resultQuantity: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  resultNutrition: {
    marginTop: 4,
  },
  resultCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  resultMacros: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestionButton: {
    width: '48%',
    marginBottom: 8,
  },
  tipsCard: {
    marginBottom: 100,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default AddFoodScreen;