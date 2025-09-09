import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../components/Cards';
import { COLORS, SCREEN_NAMES } from '../constants';

const FoodLoggingScreen = () => {
  const navigation = useNavigation();

  const loggingOptions = [
    {
      id: 'search',
      title: 'Search Food Database',
      description: 'Search our extensive food database',
      icon: 'search',
      screen: SCREEN_NAMES.ADD_FOOD,
      color: COLORS.primary,
    },
    {
      id: 'photo',
      title: 'Take Photo',
      description: 'AI-powered food recognition from photos',
      icon: 'camera',
      screen: SCREEN_NAMES.PHOTO_FOOD,
      color: COLORS.secondary,
    },
    {
      id: 'barcode',
      title: 'Scan Barcode',
      description: 'Scan product barcodes for instant nutrition info',
      icon: 'barcode',
      screen: SCREEN_NAMES.BARCODE_SCANNER,
      color: COLORS.warning,
    },
    {
      id: 'manual',
      title: 'Manual Entry',
      description: 'Describe your food in text',
      icon: 'create',
      screen: SCREEN_NAMES.ADD_FOOD,
      color: COLORS.success,
      params: { mode: 'manual' },
    },
  ];

  const handleOptionPress = (option) => {
    navigation.navigate(option.screen, option.params);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log Your Food</Text>
        <Text style={styles.subtitle}>
          Choose how you'd like to log your meal
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {loggingOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionCard}
            onPress={() => handleOptionPress(option)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
              <Ionicons name={option.icon} size={32} color={COLORS.background} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <Card title="Recent Foods" style={styles.recentCard}>
        <Text style={styles.recentText}>
          Your recently logged foods will appear here for quick re-logging
        </Text>
      </Card>

      <Card title="Quick Tips" style={styles.tipsCard}>
        <View style={styles.tip}>
          <Ionicons name="bulb-outline" size={20} color={COLORS.primary} />
          <Text style={styles.tipText}>
            Take photos in good lighting for better AI recognition
          </Text>
        </View>
        <View style={styles.tip}>
          <Ionicons name="bulb-outline" size={20} color={COLORS.primary} />
          <Text style={styles.tipText}>
            Include portion sizes in your descriptions for accuracy
          </Text>
        </View>
        <View style={styles.tip}>
          <Ionicons name="bulb-outline" size={20} color={COLORS.primary} />
          <Text style={styles.tipText}>
            Scan barcodes for packaged foods for exact nutrition data
          </Text>
        </View>
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  optionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  recentCard: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  recentText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tipsCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default FoodLoggingScreen;