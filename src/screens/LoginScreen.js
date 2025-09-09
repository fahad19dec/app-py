import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Button from '../components/Button';
import Input from '../components/Input';
import { loginSuccess } from '../store/authSlice';
import { COLORS } from '../constants';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      // For demo purposes, simulate login
      setTimeout(() => {
        dispatch(loginSuccess({
          uid: 'demo-user-123',
          email: email,
          displayName: email.split('@')[0],
        }));
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Failed', 'Please check your credentials and try again');
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google login would be implemented here with Firebase Auth');
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple Login', 'Apple login would be implemented here with Firebase Auth');
  };

  const handleRegister = () => {
    Alert.alert('Register', 'Registration screen would be implemented here');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Ionicons name="nutrition" size={80} color={COLORS.background} />
          <Text style={styles.title}>CalCount</Text>
          <Text style={styles.subtitle}>AI-Powered Nutrition Tracking</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Continue with Google"
            onPress={handleGoogleLogin}
            variant="secondary"
            style={styles.socialButton}
          />

          <Button
            title="Continue with Apple"
            onPress={handleAppleLogin}
            variant="outline"
            style={styles.socialButton}
          />

          <TouchableOpacity onPress={handleRegister} style={styles.registerLink}>
            <Text style={styles.registerText}>
              Don't have an account? <Text style={styles.registerTextBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.background,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.background,
    opacity: 0.9,
    marginTop: 8,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: COLORS.background,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.background,
    opacity: 0.3,
  },
  dividerText: {
    color: COLORS.background,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    marginBottom: 12,
    backgroundColor: COLORS.background,
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    color: COLORS.background,
    fontSize: 16,
  },
  registerTextBold: {
    fontWeight: 'bold',
  },
});

export default LoginScreen;