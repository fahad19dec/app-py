import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { CameraView, Camera } from 'expo-camera';

import Button from '../components/Button';
import { addFoodEntry } from '../store/foodSlice';
import { COLORS } from '../constants';

const BarcodeScannerScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    setLoading(true);

    try {
      // In a real app, you would use the barcode data to fetch nutrition info
      // from APIs like OpenFoodFacts, UPC Database, etc.
      const nutritionData = await fetchNutritionFromBarcode(data);
      
      if (nutritionData) {
        dispatch(addFoodEntry(nutritionData));
        Alert.alert(
          'Product Added!',
          `${nutritionData.name} has been added to your food log.`,
          [
            {
              text: 'Scan Another',
              onPress: () => {
                setScanned(false);
                setLoading(false);
              },
            },
            {
              text: 'Done',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert(
          'Product Not Found',
          'We couldn\'t find nutrition information for this product.',
          [
            {
              text: 'Try Again',
              onPress: () => {
                setScanned(false);
                setLoading(false);
              },
            },
            {
              text: 'Manual Entry',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Scan Error',
        'Failed to process barcode. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: () => setScanned(false),
          },
        ]
      );
    }
  };

  const fetchNutritionFromBarcode = async (barcode) => {
    // Mock implementation - in real app, use APIs like:
    // - OpenFoodFacts API
    // - UPC Database
    // - Edamam Food Database
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data based on common barcodes
    const mockProducts = {
      '1234567890': {
        name: 'Whole Milk (1 cup)',
        calories: 150,
        macros: {
          protein: 8,
          carbs: 12,
          fat: 8,
          fiber: 0,
          sugar: 12,
        },
        quantity: '1 cup (240ml)',
        barcode: barcode,
      },
      '0987654321': {
        name: 'Banana (Medium)',
        calories: 105,
        macros: {
          protein: 1.3,
          carbs: 27,
          fat: 0.4,
          fiber: 3.1,
          sugar: 14.4,
        },
        quantity: '1 medium (118g)',
        barcode: barcode,
      },
    };

    // Return mock data or random product for demo
    return mockProducts[barcode] || {
      name: 'Scanned Product',
      calories: 200,
      macros: {
        protein: 10,
        carbs: 25,
        fat: 8,
        fiber: 3,
        sugar: 12,
      },
      quantity: '1 serving',
      barcode: barcode,
    };
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.message}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.message}>
            Camera access is required to scan barcodes
          </Text>
          <Button
            title="Open Settings"
            onPress={() => {
              // In a real app, you might open device settings
              Alert.alert('Open device settings to grant camera permission');
            }}
            style={styles.settingsButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.scanFrame}>
              <View style={styles.corner} style={[styles.corner, styles.topLeft]} />
              <View style={styles.corner} style={[styles.corner, styles.topRight]} />
              <View style={styles.corner} style={[styles.corner, styles.bottomLeft]} />
              <View style={styles.corner} style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay}>
            <Text style={styles.instructionText}>
              {loading 
                ? 'Processing barcode...' 
                : 'Position the barcode within the frame'
              }
            </Text>
            
            {scanned && (
              <Button
                title="Scan Again"
                onPress={() => setScanned(false)}
                style={styles.scanAgainButton}
                variant="secondary"
              />
            )}
            
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              variant="outline"
            />
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  camera: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.text,
    marginBottom: 20,
  },
  settingsButton: {
    marginTop: 16,
  },
  overlay: {
    flex: 1,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 200,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scanFrame: {
    width: 250,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  instructionText: {
    color: COLORS.background,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  scanAgainButton: {
    marginBottom: 12,
    backgroundColor: COLORS.background,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.background,
  },
});

export default BarcodeScannerScreen;