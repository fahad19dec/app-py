import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';

import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

// Ignore Firebase warnings in development
LogBox.ignoreLogs([
  'Setting a timer for a long period of time',
  'AsyncStorage has been extracted from react-native',
  'Firebase',
]);

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
      <StatusBar style="auto" />
    </Provider>
  );
}
