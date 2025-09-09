import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../components/Cards';
import Button from '../components/Button';
import Input from '../components/Input';
import { updateProfile, updatePreferences, resetUser } from '../store/userSlice';
import { logout } from '../store/authSlice';
import { COLORS, FITNESS_GOALS } from '../constants';
import { 
  calculateBMR, 
  calculateTDEE, 
  calculateDailyCalorieTarget 
} from '../utils/calculations';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { profile, preferences } = useSelector(state => state.user);
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    weight: profile.weight?.toString() || '',
    height: profile.height?.toString() || '',
    goal: profile.goal || '',
  });

  const handleSaveProfile = () => {
    const updatedProfile = {
      ...profile,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      goal: formData.goal,
    };

    // Recalculate daily calorie target
    const bmr = calculateBMR(
      updatedProfile.weight,
      updatedProfile.height,
      updatedProfile.age,
      updatedProfile.gender
    );
    const tdee = calculateTDEE(bmr, updatedProfile.activityLevel);
    const dailyCalorieTarget = calculateDailyCalorieTarget(tdee, updatedProfile.goal);
    
    updatedProfile.dailyCalorieTarget = dailyCalorieTarget;

    dispatch(updateProfile(updatedProfile));
    setEditMode(false);
    Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            dispatch(resetUser());
          }
        },
      ]
    );
  };

  const ProfileHeader = () => (
    <Card gradient style={styles.headerCard}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={COLORS.background} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setEditMode(!editMode)}
          style={styles.editButton}
        >
          <Ionicons 
            name={editMode ? "checkmark" : "create"} 
            size={24} 
            color={COLORS.background} 
          />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const ProfileStats = () => (
    <Card title="Your Stats">
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.age || 'N/A'}</Text>
          <Text style={styles.statLabel}>Age</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {profile.weight ? `${profile.weight}kg` : 'N/A'}
          </Text>
          <Text style={styles.statLabel}>Weight</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {profile.height ? `${profile.height}cm` : 'N/A'}
          </Text>
          <Text style={styles.statLabel}>Height</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {profile.dailyCalorieTarget || 'N/A'}
          </Text>
          <Text style={styles.statLabel}>Daily Target</Text>
        </View>
      </View>
    </Card>
  );

  const EditProfileForm = () => (
    editMode && (
      <Card title="Edit Profile">
        <Input
          label="Weight (kg)"
          value={formData.weight}
          onChangeText={(value) => setFormData(prev => ({ ...prev, weight: value }))}
          keyboardType="numeric"
          placeholder="Enter your weight"
        />
        
        <Input
          label="Height (cm)"
          value={formData.height}
          onChangeText={(value) => setFormData(prev => ({ ...prev, height: value }))}
          keyboardType="numeric"
          placeholder="Enter your height"
        />

        <Text style={styles.sectionLabel}>Fitness Goal</Text>
        {Object.values(FITNESS_GOALS).map((goal) => (
          <Button
            key={goal}
            title={getGoalLabel(goal)}
            onPress={() => setFormData(prev => ({ ...prev, goal }))}
            variant={formData.goal === goal ? 'primary' : 'outline'}
            style={styles.goalButton}
          />
        ))}

        <View style={styles.editActions}>
          <Button
            title="Cancel"
            onPress={() => {
              setEditMode(false);
              setFormData({
                weight: profile.weight?.toString() || '',
                height: profile.height?.toString() || '',
                goal: profile.goal || '',
              });
            }}
            variant="outline"
            style={styles.editActionButton}
          />
          <Button
            title="Save"
            onPress={handleSaveProfile}
            style={styles.editActionButton}
          />
        </View>
      </Card>
    )
  );

  const PreferencesCard = () => (
    <Card title="Preferences">
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Dark Mode</Text>
        <Switch
          value={preferences.darkMode || false}
          onValueChange={(value) => 
            dispatch(updatePreferences({ darkMode: value }))
          }
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
        />
      </View>
      
      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Notifications</Text>
        <Switch
          value={preferences.notifications !== false}
          onValueChange={(value) => 
            dispatch(updatePreferences({ notifications: value }))
          }
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
        />
      </View>

      <View style={styles.preferenceItem}>
        <Text style={styles.preferenceLabel}>Units</Text>
        <View style={styles.unitButtons}>
          <Button
            title="Metric"
            onPress={() => dispatch(updatePreferences({ units: 'metric' }))}
            variant={preferences.units === 'metric' ? 'primary' : 'outline'}
            style={styles.unitButton}
          />
          <Button
            title="Imperial"
            onPress={() => dispatch(updatePreferences({ units: 'imperial' }))}
            variant={preferences.units === 'imperial' ? 'primary' : 'outline'}
            style={styles.unitButton}
          />
        </View>
      </View>
    </Card>
  );

  const MenuCard = () => (
    <Card title="Menu">
      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
        <Text style={styles.menuText}>Help & Support</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
        <Text style={styles.menuText}>Privacy Policy</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
        <Text style={styles.menuText}>About CalCount</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
        <Text style={[styles.menuText, { color: COLORS.error }]}>Logout</Text>
        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </Card>
  );

  const getGoalLabel = (goal) => {
    const labels = {
      lose_weight: 'Lose Weight',
      maintain_weight: 'Maintain Weight',
      gain_weight: 'Gain Weight',
      build_muscle: 'Build Muscle',
    };
    return labels[goal];
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader />
        <ProfileStats />
        <EditProfileForm />
        <PreferencesCard />
        <MenuCard />
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
  headerCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.background,
    opacity: 0.8,
    marginTop: 2,
  },
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  goalButton: {
    marginBottom: 8,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  preferenceLabel: {
    fontSize: 16,
    color: COLORS.text,
  },
  unitButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
});

export default ProfileScreen;