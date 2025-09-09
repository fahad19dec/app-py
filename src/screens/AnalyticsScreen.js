import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { VictoryChart, VictoryLine, VictoryBar, VictoryArea, VictoryTheme, VictoryPie } from 'victory-native';

import { Card } from '../components/Cards';
import Button from '../components/Button';
import { COLORS } from '../constants';
import { formatDate, getWeekStart, getMonthStart } from '../utils/calculations';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 64;

const AnalyticsScreen = () => {
  const { todayStats } = useSelector(state => state.food);
  const { profile } = useSelector(state => state.user);
  const [timeRange, setTimeRange] = useState('week'); // 'week' or 'month'

  // Mock data for charts - in a real app, this would come from your store/database
  const generateMockData = (days) => {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        x: i + 1,
        y: Math.floor(Math.random() * 800) + 1200, // Random calories between 1200-2000
        date: formatDate(date),
        protein: Math.floor(Math.random() * 50) + 50,
        carbs: Math.floor(Math.random() * 100) + 150,
        fat: Math.floor(Math.random() * 40) + 40,
      };
    });
  };

  const weeklyData = generateMockData(7);
  const monthlyData = generateMockData(30);
  const currentData = timeRange === 'week' ? weeklyData : monthlyData;

  const macroData = [
    { x: 'Protein', y: todayStats.macros.protein || 0 },
    { x: 'Carbs', y: todayStats.macros.carbs || 0 },
    { x: 'Fat', y: todayStats.macros.fat || 0 },
  ];

  const CalorieChart = () => (
    <Card title={`Calorie Intake - ${timeRange === 'week' ? 'Last 7 Days' : 'Last 30 Days'}`}>
      <View style={styles.chartControls}>
        <Button
          title="Week"
          onPress={() => setTimeRange('week')}
          variant={timeRange === 'week' ? 'primary' : 'outline'}
          style={styles.chartButton}
        />
        <Button
          title="Month"
          onPress={() => setTimeRange('month')}
          variant={timeRange === 'month' ? 'primary' : 'outline'}
          style={styles.chartButton}
        />
      </View>
      
      <VictoryChart
        theme={VictoryTheme.material}
        width={chartWidth}
        height={200}
        padding={{ left: 60, top: 20, right: 40, bottom: 40 }}
      >
        <VictoryArea
          data={currentData}
          style={{
            data: { fill: COLORS.primary, opacity: 0.3 },
          }}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
          }}
        />
        <VictoryLine
          data={currentData}
          style={{
            data: { stroke: COLORS.primary, strokeWidth: 2 },
          }}
          animate={{
            duration: 2000,
            onLoad: { duration: 1000 }
          }}
        />
      </VictoryChart>
      
      <View style={styles.chartStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.round(currentData.reduce((sum, day) => sum + day.y, 0) / currentData.length)}
          </Text>
          <Text style={styles.statLabel}>Avg Calories</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.max(...currentData.map(day => day.y))}
          </Text>
          <Text style={styles.statLabel}>Highest Day</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.min(...currentData.map(day => day.y))}
          </Text>
          <Text style={styles.statLabel}>Lowest Day</Text>
        </View>
      </View>
    </Card>
  );

  const MacroChart = () => (
    <Card title="Today's Macronutrient Breakdown">
      <VictoryPie
        data={macroData}
        width={chartWidth}
        height={200}
        colorScale={[COLORS.primary, COLORS.secondary, COLORS.warning]}
        labelComponent={<></>}
        animate={{
          duration: 2000,
        }}
      />
      
      <View style={styles.macroLegend}>
        {macroData.map((macro, index) => (
          <View key={macro.x} style={styles.legendItem}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: [COLORS.primary, COLORS.secondary, COLORS.warning][index] }
              ]} 
            />
            <Text style={styles.legendText}>
              {macro.x}: {Math.round(macro.y)}g
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );

  const NutritionInsights = () => {
    const avgProtein = currentData.reduce((sum, day) => sum + day.protein, 0) / currentData.length;
    const avgCarbs = currentData.reduce((sum, day) => sum + day.carbs, 0) / currentData.length;
    const avgFat = currentData.reduce((sum, day) => sum + day.fat, 0) / currentData.length;
    
    const insights = [];
    
    if (avgProtein < 50) {
      insights.push({
        type: 'warning',
        title: 'Low Protein Intake',
        message: 'Consider adding more lean proteins to your meals.',
      });
    }
    
    if (avgCarbs > 250) {
      insights.push({
        type: 'info',
        title: 'High Carb Intake',
        message: 'You might want to balance with more proteins and healthy fats.',
      });
    }
    
    if (todayStats.totalCalories < (profile.dailyCalorieTarget || 2000) * 0.8) {
      insights.push({
        type: 'warning',
        title: 'Low Calorie Intake',
        message: 'Make sure you\'re eating enough to meet your goals.',
      });
    }

    return (
      <Card title="Nutrition Insights">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightMessage}>{insight.message}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noInsights}>
            Great job! Your nutrition looks balanced. Keep it up! 🎉
          </Text>
        )}
      </Card>
    );
  };

  const ProgressSummary = () => (
    <Card title="Weekly Progress Summary">
      <View style={styles.progressGrid}>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>
            {currentData.filter(day => day.y <= (profile.dailyCalorieTarget || 2000)).length}
          </Text>
          <Text style={styles.progressLabel}>Days on Target</Text>
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>
            {Math.round(avgProtein)}g
          </Text>
          <Text style={styles.progressLabel}>Avg Protein</Text>
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressValue}>
            {currentData.length}
          </Text>
          <Text style={styles.progressLabel}>Days Tracked</Text>
        </View>
      </View>
    </Card>
  );

  const GoalProgress = () => {
    const targetCalories = profile.dailyCalorieTarget || 2000;
    const progress = (todayStats.totalCalories / targetCalories) * 100;
    
    return (
      <Card title="Today's Goal Progress">
        <View style={styles.goalContainer}>
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Calories</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: progress > 100 ? COLORS.warning : COLORS.primary,
                  }
                ]} 
              />
            </View>
            <Text style={styles.goalText}>
              {Math.round(todayStats.totalCalories)} / {targetCalories} cal
            </Text>
          </View>
          
          <View style={styles.goalItem}>
            <Text style={styles.goalLabel}>Protein (25% target)</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min((todayStats.macros.protein * 4 / targetCalories) * 100, 100)}%`,
                    backgroundColor: COLORS.secondary,
                  }
                ]} 
              />
            </View>
            <Text style={styles.goalText}>
              {Math.round(todayStats.macros.protein)}g / {Math.round(targetCalories * 0.25 / 4)}g
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <GoalProgress />
        <CalorieChart />
        <MacroChart />
        <ProgressSummary />
        <NutritionInsights />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  chartControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  chartButton: {
    flex: 1,
    maxWidth: 100,
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  macroLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.text,
  },
  insightItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  noInsights: {
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  goalContainer: {
    gap: 16,
  },
  goalItem: {
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
});

export default AnalyticsScreen;