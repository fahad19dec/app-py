import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';

const Card = ({ 
  title, 
  children, 
  style, 
  headerStyle, 
  gradient = false,
  gradientColors = [COLORS.primary, COLORS.secondary]
}) => {
  const CardComponent = gradient ? LinearGradient : View;
  const cardProps = gradient ? { colors: gradientColors } : {};

  return (
    <CardComponent 
      style={[styles.card, style]} 
      {...cardProps}
    >
      {title && (
        <Text style={[
          styles.title, 
          gradient && styles.titleGradient,
          headerStyle
        ]}>
          {title}
        </Text>
      )}
      {children}
    </CardComponent>
  );
};

const CalorieCard = ({ consumed, remaining, target }) => {
  const percentage = target > 0 ? (consumed / target) * 100 : 0;
  
  return (
    <Card gradient title="Daily Calories" style={styles.calorieCard}>
      <View style={styles.calorieContent}>
        <View style={styles.calorieRow}>
          <Text style={styles.calorieLabel}>Consumed</Text>
          <Text style={styles.calorieValue}>{Math.round(consumed)}</Text>
        </View>
        <View style={styles.calorieRow}>
          <Text style={styles.calorieLabel}>Remaining</Text>
          <Text style={styles.calorieValue}>{Math.round(remaining)}</Text>
        </View>
        <View style={styles.calorieRow}>
          <Text style={styles.calorieLabel}>Target</Text>
          <Text style={styles.calorieValue}>{Math.round(target)}</Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min(percentage, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.percentageText}>
          {Math.round(percentage)}% of target
        </Text>
      </View>
    </Card>
  );
};

const MacroCard = ({ protein, carbs, fat, fiber, sugar }) => {
  return (
    <Card title="Macronutrients">
      <View style={styles.macroGrid}>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{Math.round(protein)}g</Text>
          <Text style={styles.macroLabel}>Protein</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{Math.round(carbs)}g</Text>
          <Text style={styles.macroLabel}>Carbs</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{Math.round(fat)}g</Text>
          <Text style={styles.macroLabel}>Fat</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{Math.round(fiber)}g</Text>
          <Text style={styles.macroLabel}>Fiber</Text>
        </View>
        <View style={styles.macroItem}>
          <Text style={styles.macroValue}>{Math.round(sugar)}g</Text>
          <Text style={styles.macroLabel}>Sugar</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  titleGradient: {
    color: COLORS.background,
  },
  calorieCard: {
    marginBottom: 16,
  },
  calorieContent: {
    // Additional styling for calorie card content
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calorieLabel: {
    fontSize: 16,
    color: COLORS.background,
    opacity: 0.9,
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 4,
  },
  percentageText: {
    textAlign: 'center',
    color: COLORS.background,
    fontWeight: '600',
  },
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  macroItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 12,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  macroLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});

export { Card, CalorieCard, MacroCard };