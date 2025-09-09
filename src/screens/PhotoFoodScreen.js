import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

import Button from '../components/Button';
import { Card } from '../components/Cards';
import { addFoodEntry } from '../store/foodSlice';
import openAIService from '../services/openai';
import { COLORS } from '../constants';

const PhotoFoodScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and photo library access are required for food photo analysis.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0]);
      analyzeImage(result.assets[0]);
    }
  };

  const selectFromGallery = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0]);
      analyzeImage(result.assets[0]);
    }
  };

  const analyzeImage = async (imageAsset) => {
    setLoading(true);
    setAnalysisResult(null);

    try {
      const result = await openAIService.analyzeFoodImage(imageAsset.base64);
      setAnalysisResult(result);
    } catch (error) {
      Alert.alert(
        'Analysis Failed',
        'Failed to analyze the food image. Please try again or use manual entry.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = (foodItem) => {
    const entry = {
      ...foodItem,
      mealType: 'snacks', // Default meal type, could be made selectable
      source: 'photo_analysis',
      imageUri: selectedImage?.uri,
      timestamp: new Date().toISOString(),
    };

    dispatch(addFoodEntry(entry));
    
    Alert.alert(
      'Food Added!',
      `${foodItem.name} has been added to your food log.`,
      [
        {
          text: 'Add Another',
          onPress: () => {
            setSelectedImage(null);
            setAnalysisResult(null);
          },
        },
        {
          text: 'Done',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const PhotoOptions = () => (
    <Card title="Add Food Photo">
      <View style={styles.photoOptionsContainer}>
        <Button
          title="Take Photo"
          onPress={takePhoto}
          style={styles.photoButton}
        />
        <Button
          title="Choose from Gallery"
          onPress={selectFromGallery}
          variant="secondary"
          style={styles.photoButton}
        />
      </View>
    </Card>
  );

  const ImagePreview = () => (
    selectedImage && (
      <Card title="Selected Image">
        <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
        <View style={styles.imageActions}>
          <Button
            title="Retake"
            onPress={() => {
              setSelectedImage(null);
              setAnalysisResult(null);
            }}
            variant="outline"
            style={styles.imageActionButton}
          />
          <Button
            title="Analyze Again"
            onPress={() => analyzeImage(selectedImage)}
            variant="secondary"
            style={styles.imageActionButton}
            loading={loading}
          />
        </View>
      </Card>
    )
  );

  const AnalysisResults = () => (
    analysisResult && (
      <Card title="AI Analysis Results">
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Analyzing your food...</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.confidenceText}>
              Confidence: {Math.round((analysisResult.confidence || 0.7) * 100)}%
            </Text>
            
            {analysisResult.foodItems?.map((item, index) => (
              <View key={index} style={styles.resultItem}>
                <View style={styles.resultContent}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  <Text style={styles.resultQuantity}>{item.quantity}</Text>
                  <View style={styles.resultNutrition}>
                    <Text style={styles.resultCalories}>
                      {Math.round(item.calories)} calories
                    </Text>
                    <Text style={styles.resultMacros}>
                      Protein: {Math.round(item.macros?.protein || 0)}g • 
                      Carbs: {Math.round(item.macros?.carbs || 0)}g • 
                      Fat: {Math.round(item.macros?.fat || 0)}g
                    </Text>
                  </View>
                </View>
                <Button
                  title="Add"
                  onPress={() => handleAddFood(item)}
                  style={styles.addButton}
                />
              </View>
            ))}
            
            <Text style={styles.disclaimerText}>
              * AI estimates may not be 100% accurate. Adjust quantities as needed.
            </Text>
          </View>
        )}
      </Card>
    )
  );

  const TipsCard = () => (
    <Card title="Photo Tips" style={styles.tipsCard}>
      <View style={styles.tip}>
        <Text style={styles.tipNumber}>1</Text>
        <Text style={styles.tipText}>
          Take photos in good lighting for better recognition
        </Text>
      </View>
      <View style={styles.tip}>
        <Text style={styles.tipNumber}>2</Text>
        <Text style={styles.tipText}>
          Include the entire meal in the frame
        </Text>
      </View>
      <View style={styles.tip}>
        <Text style={styles.tipNumber}>3</Text>
        <Text style={styles.tipText}>
          Place food on a contrasting background when possible
        </Text>
      </View>
      <View style={styles.tip}>
        <Text style={styles.tipNumber}>4</Text>
        <Text style={styles.tipText}>
          Avoid photos with hands or utensils covering the food
        </Text>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!selectedImage && <PhotoOptions />}
        
        <ImagePreview />
        
        <AnalysisResults />
        
        {!selectedImage && <TipsCard />}
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
  photoOptionsContainer: {
    gap: 12,
  },
  photoButton: {
    marginBottom: 8,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  confidenceText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  resultQuantity: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  resultNutrition: {
    marginTop: 4,
  },
  resultCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  resultMacros: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  disclaimerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  tipsCard: {
    marginTop: 20,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    width: 20,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default PhotoFoodScreen;