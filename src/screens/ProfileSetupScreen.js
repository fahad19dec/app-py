import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

import Button from '../components/Button';
import Input from '../components/Input';
import { updateProfile, setDailyCalorieTarget } from '../store/userSlice';
import { COLORS, SCREEN_NAMES, FITNESS_GOALS, ACTIVITY_LEVELS } from '../constants';
import { 
  calculateBMR, 
  calculateTDEE, 
  calculateDailyCalorieTarget,
  validateAge,
  validateWeight,
  validateHeight
} from '../utils/calculations';

const ProfileSetupScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: '',
    goal: '',
  });
  
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (!validateAge(parseInt(formData.age))) {
      newErrors.age = 'Please enter a valid age (13-120)';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.weight) {
      newErrors.weight = 'Weight is required';
    } else if (!validateWeight(parseFloat(formData.weight), 'kg')) {
      newErrors.weight = 'Please enter a valid weight (30-300 kg)';
    }

    if (!formData.height) {
      newErrors.height = 'Height is required';
    } else if (!validateHeight(parseFloat(formData.height), 'cm')) {
      newErrors.height = 'Please enter a valid height (100-250 cm)';
    }

    if (!formData.activityLevel) {
      newErrors.activityLevel = 'Activity level is required';
    }

    if (!formData.goal) {
      newErrors.goal = 'Fitness goal is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Please correct the errors and try again');
      return;
    }

    const profileData = {
      age: parseInt(formData.age),
      gender: formData.gender,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      activityLevel: formData.activityLevel,
      goal: formData.goal,
    };

    // Calculate BMR, TDEE, and daily calorie target
    const bmr = calculateBMR(
      profileData.weight,
      profileData.height,
      profileData.age,
      profileData.gender
    );
    
    const tdee = calculateTDEE(bmr, profileData.activityLevel);
    const dailyCalorieTarget = calculateDailyCalorieTarget(tdee, profileData.goal);

    profileData.dailyCalorieTarget = dailyCalorieTarget;

    dispatch(updateProfile(profileData));
    dispatch(setDailyCalorieTarget(dailyCalorieTarget));

    Alert.alert(
      'Profile Setup Complete!',
      `Your daily calorie target is ${dailyCalorieTarget} calories based on your goals.`,
      [
        {
          text: 'Continue',
          onPress: () => navigation.navigate(SCREEN_NAMES.ONBOARDING),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
      >
        <Text style={styles.title}>Setup Your Profile</Text>
        <Text style={styles.subtitle}>
          Tell us about yourself to get personalized recommendations
        </Text>
      </LinearGradient>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <Input
          label="Age"
          value={formData.age}
          onChangeText={(value) => updateField('age', value)}
          placeholder="Enter your age"
          keyboardType="numeric"
          error={errors.age}
        />

        <View style={styles.genderContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderButtons}>
            <Button
              title="Male"
              onPress={() => updateField('gender', 'male')}
              variant={formData.gender === 'male' ? 'primary' : 'outline'}
              style={styles.genderButton}
            />
            <Button
              title="Female"
              onPress={() => updateField('gender', 'female')}
              variant={formData.gender === 'female' ? 'primary' : 'outline'}
              style={styles.genderButton}
            />
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        </View>

        <Input
          label="Weight (kg)"
          value={formData.weight}
          onChangeText={(value) => updateField('weight', value)}
          placeholder="Enter your weight"
          keyboardType="numeric"
          error={errors.weight}
        />

        <Input
          label="Height (cm)"
          value={formData.height}
          onChangeText={(value) => updateField('height', value)}
          placeholder="Enter your height"
          keyboardType="numeric"
          error={errors.height}
        />

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Activity Level</Text>
          {Object.entries(ACTIVITY_LEVELS).map(([key, value]) => (
            <Button
              key={key}
              title={getActivityLevelLabel(key)}
              onPress={() => updateField('activityLevel', key)}
              variant={formData.activityLevel === key ? 'primary' : 'outline'}
              style={styles.optionButton}
            />
          ))}
          {errors.activityLevel && <Text style={styles.errorText}>{errors.activityLevel}</Text>}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Fitness Goal</Text>
          {Object.values(FITNESS_GOALS).map((goal) => (
            <Button
              key={goal}
              title={getGoalLabel(goal)}
              onPress={() => updateField('goal', goal)}
              variant={formData.goal === goal ? 'primary' : 'outline'}
              style={styles.optionButton}
            />
          ))}
          {errors.goal && <Text style={styles.errorText}>{errors.goal}</Text>}
        </View>

        <Button
          title="Save Profile"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const getActivityLevelLabel = (level) => {
  const labels = {
    SEDENTARY: 'Sedentary (little/no exercise)',
    LIGHTLY_ACTIVE: 'Lightly Active (light exercise 1-3 days/week)',
    MODERATELY_ACTIVE: 'Moderately Active (moderate exercise 3-5 days/week)',
    VERY_ACTIVE: 'Very Active (hard exercise 6-7 days/week)',
    EXTREMELY_ACTIVE: 'Extremely Active (very hard exercise, physical job)',
  };
  return labels[level];
};

const getGoalLabel = (goal) => {
  const labels = {
    lose_weight: 'Lose Weight',
    maintain_weight: 'Maintain Weight',
    gain_weight: 'Gain Weight',
    build_muscle: 'Build Muscle',
  };
  return labels[goal];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.background,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.background,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  genderContainer: {
    marginBottom: 20,
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  optionButton: {
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 40,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginTop: 4,
  },
});

export default ProfileSetupScreen;