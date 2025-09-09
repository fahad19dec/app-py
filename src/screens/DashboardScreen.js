import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { CalorieCard, MacroCard, Card } from '../components/Cards';
import Button from '../components/Button';
import { COLORS, SCREEN_NAMES, MEAL_TYPES } from '../constants';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { profile } = useSelector(state => state.user);
  const { todayStats, dailyEntries } = useSelector(state => state.food);

  const remainingCalories = Math.max(0, (profile.dailyCalorieTarget || 2000) - todayStats.totalCalories);

  const handleAddFood = () => {
    navigation.navigate(SCREEN_NAMES.ADD_FOOD);
  };

  const handleQuickAdd = (mealType) => {
    navigation.navigate(SCREEN_NAMES.ADD_FOOD, { mealType });
  };

  const MealSection = ({ mealType, data }) => {
    const mealLabels = {
      breakfast: 'Breakfast',
      lunch: 'Lunch', 
      dinner: 'Dinner',
      snacks: 'Snacks',
    };

    return (
      <Card title={mealLabels[mealType]} style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealCalories}>
            {Math.round(data.calories)} calories
          </Text>
          <TouchableOpacity 
            onPress={() => handleQuickAdd(mealType)}
            style={styles.addMealButton}
          >
            <Ionicons name="add" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        
        {data.items.length > 0 ? (
          <View style={styles.mealItems}>
            {data.items.slice(0, 3).map((item, index) => (
              <View key={index} style={styles.mealItem}>
                <Text style={styles.mealItemName} numberOfLines={1}>
                  {item.name || 'Food Item'}
                </Text>
                <Text style={styles.mealItemCalories}>
                  {Math.round(item.calories)}cal
                </Text>
              </View>
            ))}
            {data.items.length > 3 && (
              <Text style={styles.moreItems}>
                +{data.items.length - 3} more items
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.noMealsText}>No items logged yet</Text>
        )}
      </Card>
    );
  };

  const QuickActions = () => (
    <Card title="Quick Actions" style={styles.quickActionsCard}>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate(SCREEN_NAMES.PHOTO_FOOD)}
        >
          <Ionicons name="camera" size={24} color={COLORS.primary} />
          <Text style={styles.quickActionText}>Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate(SCREEN_NAMES.BARCODE_SCANNER)}
        >
          <Ionicons name="barcode" size={24} color={COLORS.primary} />
          <Text style={styles.quickActionText}>Scan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={handleAddFood}
        >
          <Ionicons name="search" size={24} color={COLORS.primary} />
          <Text style={styles.quickActionText}>Search</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => navigation.navigate(SCREEN_NAMES.ANALYTICS)}
        >
          <Ionicons name="analytics" size={24} color={COLORS.primary} />
          <Text style={styles.quickActionText}>Analytics</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const TodaysSummary = () => (
    <Card title="Today's Summary">
      <View style={styles.summaryGrid}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{dailyEntries.length}</Text>
          <Text style={styles.summaryLabel}>Items Logged</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {Math.round(todayStats.macros.protein)}g
          </Text>
          <Text style={styles.summaryLabel}>Protein</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {Math.round(todayStats.totalCalories / (profile.dailyCalorieTarget || 2000) * 100)}%
          </Text>
          <Text style={styles.summaryLabel}>Goal Progress</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good day!</Text>
          <Text style={styles.username}>
            {profile.name || 'User'}
          </Text>
        </View>

        <CalorieCard
          consumed={todayStats.totalCalories}
          remaining={remainingCalories}
          target={profile.dailyCalorieTarget || 2000}
        />

        <MacroCard
          protein={todayStats.macros.protein}
          carbs={todayStats.macros.carbs}
          fat={todayStats.macros.fat}
          fiber={todayStats.macros.fiber}
          sugar={todayStats.macros.sugar}
        />

        <QuickActions />

        <TodaysSummary />

        {Object.entries(todayStats.mealBreakdown).map(([mealType, data]) => (
          <MealSection key={mealType} mealType={mealType} data={data} />
        ))}

        <Button
          title="Log Your First Meal"
          onPress={handleAddFood}
          style={styles.addFoodButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: COLORS.background,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 4,
  },
  quickActionsCard: {
    marginHorizontal: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionItem: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  quickActionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  mealCard: {
    marginHorizontal: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  addMealButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealItems: {
    // Styling for meal items list
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  mealItemName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  mealItemCalories: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  moreItems: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  noMealsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  addFoodButton: {
    marginHorizontal: 16,
    marginTop: 24,
  },
});

export default DashboardScreen;