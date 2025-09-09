import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Button from '../components/Button';
import { completeOnboarding } from '../store/userSlice';
import { COLORS } from '../constants';

const OnboardingScreen = () => {
  const dispatch = useDispatch();

  const handleComplete = () => {
    dispatch(completeOnboarding());
  };

  const features = [
    {
      icon: 'camera-outline',
      title: 'Photo Analysis',
      description: 'Take photos of your food and get instant calorie estimates using AI',
    },
    {
      icon: 'barcode-outline',
      title: 'Barcode Scanner',
      description: 'Scan product barcodes for accurate nutrition information',
    },
    {
      icon: 'analytics-outline',
      title: 'Smart Analytics',
      description: 'Track your progress with detailed charts and insights',
    },
    {
      icon: 'bulb-outline',
      title: 'AI Recommendations',
      description: 'Get personalized meal suggestions and healthier alternatives',
    },
    {
      icon: 'sync-outline',
      title: 'Cloud Sync',
      description: 'Access your data across all devices with secure cloud backup',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Ionicons name="checkmark-circle" size={80} color={COLORS.background} />
            <Text style={styles.title}>Welcome to CalCount!</Text>
            <Text style={styles.subtitle}>
              Your profile is set up and ready. Here's what you can do:
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons 
                    name={feature.icon} 
                    size={32} 
                    color={COLORS.primary} 
                  />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.tipContainer}>
            <Ionicons name="lightbulb-outline" size={24} color={COLORS.background} />
            <Text style={styles.tipText}>
              Tip: Start by logging your first meal to see how easy it is!
            </Text>
          </View>

          <Button
            title="Get Started"
            onPress={handleComplete}
            style={styles.startButton}
            textStyle={styles.startButtonText}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.background,
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.background,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.9,
    lineHeight: 24,
  },
  featuresContainer: {
    flex: 1,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.background,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.background,
    opacity: 0.9,
    lineHeight: 20,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
  },
  tipText: {
    fontSize: 16,
    color: COLORS.background,
    marginLeft: 12,
    flex: 1,
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 16,
    marginTop: 'auto',
  },
  startButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;