import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "calcount-demo.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "calcount-demo",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "calcount-demo.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
  // Initialize Firestore
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization failed:', error);
  // For demo purposes, create mock objects
  auth = null;
  db = null;
}

export { auth, db };
export default app;