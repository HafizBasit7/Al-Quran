// screens/HajjUmrahGuide.js

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Share,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import HajjUmrahService from '../services/hajjUmrahService';

const { width } = Dimensions.get('window');

const HajjUmrahGuide = () => {
  const [activeTab, setActiveTab] = useState('hajj');
  const [expandedStep, setExpandedStep] = useState(null);
  const [expandedPlace, setExpandedPlace] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const hajjData = HajjUmrahService.getHajjSteps();
  const umrahData = HajjUmrahService.getUmrahSteps();
  const importantPlaces = HajjUmrahService.getImportantPlaces();
  const hajjTips = HajjUmrahService.getQuickTips('hajj');
  const umrahTips = HajjUmrahService.getQuickTips('umrah');
  const hajjMistakes = HajjUmrahService.getCommonMistakes('hajj');
  const umrahMistakes = HajjUmrahService.getCommonMistakes('umrah');

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    fadeIn();
  }, [activeTab]);

  const toggleStep = (stepId) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const togglePlace = (placeId) => {
    setExpandedPlace(expandedPlace === placeId ? null : placeId);
  };

  const shareGuide = async (type) => {
    try {
      const guide = type === 'hajj' ? hajjData : umrahData;
      const message = `Check out this ${guide.title} from Islamic Calendar App:\n\n${guide.description}\n\nDuration: ${guide.duration}\n\nDownload the app for complete guidance!`;
      
      await Share.share({
        message,
        title: guide.title
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share guide');
    }
  };

  const ProgressTracker = ({ currentStep, totalSteps, type }) => {
    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>
          {type === 'hajj' ? 'Hajj Progress' : 'Umrah Progress'}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${(currentStep / totalSteps) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>
    );
  };

  const QuickTips = ({ tips, title }) => {
    return (
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>{title}</Text>
        {tips.map((tip, index) => (
          <View key={index} style={styles.tipItem}>
            <Ionicons name="bulb-outline" size={16} color="#FFD700" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    );
  };

  const CommonMistakes = ({ mistakes, title }) => {
    return (
      <View style={styles.mistakesContainer}>
        <Text style={styles.mistakesTitle}>{title}</Text>
        {mistakes.map((mistake, index) => (
          <View key={index} style={styles.mistakeItem}>
            <Ionicons name="warning-outline" size={16} color="#FF6B6B" />
            <Text style={styles.mistakeText}>{mistake}</Text>
          </View>
        ))}
      </View>
    );
  };

  const ImagePlaceholder = ({ imageName, title }) => {
    return (
      <View style={styles.imagePlaceholder}>
        <Ionicons name="image-outline" size={40} color="#ccc" />
        <Text style={styles.imageText}>{title}</Text>
        <Text style={styles.imageSubtext}>(Image: {imageName})</Text>
      </View>
    );
  };

  const renderStepCard = (step, index, totalSteps, type) => {
    const isExpanded = expandedStep === step.id;
    
    return (
      <TouchableOpacity
        key={step.id}
        style={styles.stepCard}
        onPress={() => toggleStep(step.id)}
        activeOpacity={0.7}
      >
        <View style={styles.stepHeader}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{step.id}</Text>
          </View>
          <View style={styles.stepTitleContainer}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
          </View>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#666" 
          />
        </View>

        {isExpanded && (
          <View style={styles.stepContent}>
            {/* Progress for current step */}
            <ProgressTracker currentStep={step.id} totalSteps={totalSteps} type={type} />

            {/* Image Placeholder */}
            <ImagePlaceholder imageName={step.image} title={step.title} />

            <Text style={styles.stepDescription}>{step.description}</Text>
            
            {/* Timing */}
            <View style={styles.timingContainer}>
              <Ionicons name="time-outline" size={16} color="#4CAF50" />
              <Text style={styles.timingText}>{step.timing}</Text>
            </View>

            {/* Main Arabic Dua */}
            <View style={styles.arabicContainer}>
              <Text style={styles.arabicText}>{step.arabic}</Text>
              <Text style={styles.transliterationText}>{step.transliteration}</Text>
              <Text style={styles.translationText}>"{step.translation}"</Text>
            </View>

            {/* Additional Duas */}
            {step.duas && step.duas.map((dua, idx) => (
              <View key={idx} style={styles.duaContainer}>
                <Text style={styles.duaArabic}>{dua.arabic}</Text>
                <Text style={styles.duaTransliteration}>{dua.transliteration}</Text>
                <Text style={styles.duaTranslation}>"{dua.translation}"</Text>
              </View>
            ))}

            {/* Important Notes */}
            <View style={styles.notesContainer}>
              <Text style={styles.notesTitle}>Important Notes:</Text>
              {step.importantNotes && step.importantNotes.map((note, noteIndex) => (
                <View key={noteIndex} style={styles.noteItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              ))}
            </View>

            {/* Prohibited Actions for Ihram */}
            {step.prohibitedActions && (
              <View style={styles.prohibitedContainer}>
                <Text style={styles.prohibitedTitle}>Prohibited During Ihram:</Text>
                {step.prohibitedActions.map((action, actionIndex) => (
                  <View key={actionIndex} style={styles.prohibitedItem}>
                    <Ionicons name="close-circle" size={16} color="#FF6B6B" />
                    <Text style={styles.prohibitedText}>{action}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Historical Context */}
            {step.historicalContext && (
              <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Historical Context</Text>
                <Text style={styles.historyText}>{step.historicalContext}</Text>
              </View>
            )}

            {/* Best Practices */}
            {step.bestPractices && (
              <View style={styles.practicesContainer}>
                <Text style={styles.practicesTitle}>Best Practices</Text>
                {step.bestPractices.map((practice, practiceIndex) => (
                  <View key={practiceIndex} style={styles.practiceItem}>
                    <Ionicons name="thumbs-up" size={14} color="#4CAF50" />
                    <Text style={styles.practiceText}>{practice}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Circuit-specific Duas for Tawaf */}
            {step.circuitDuas && (
              <View style={styles.circuitDuasContainer}>
                <Text style={styles.circuitDuasTitle}>Circuit-specific Duas</Text>
                {step.circuitDuas.map((circuitDua, circuitIndex) => (
                  <View key={circuitIndex} style={styles.circuitDuaItem}>
                    <Text style={styles.circuitDuaPosition}>{circuitDua.circuit}:</Text>
                    <Text style={styles.circuitDuaArabic}>{circuitDua.arabic}</Text>
                    <Text style={styles.circuitDuaTranslation}>"{circuitDua.translation}"</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Completion Benefits */}
            {step.completionBenefits && (
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>After Completion</Text>
                {step.completionBenefits.map((benefit, benefitIndex) => (
                  <View key={benefitIndex} style={styles.benefitItem}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Farewell Duas */}
            {step.farewellDuas && (
              <View style={styles.farewellContainer}>
                <Text style={styles.farewellTitle}>Farewell Duas</Text>
                {step.farewellDuas.map((dua, farewellIndex) => (
                  <View key={farewellIndex} style={styles.farewellDuaItem}>
                    <Text style={styles.farewellArabic}>{dua.arabic}</Text>
                    <Text style={styles.farewellTransliteration}>{dua.transliteration}</Text>
                    <Text style={styles.farewellTranslation}>"{dua.translation}"</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPlaceCard = (place) => {
    const isExpanded = expandedPlace === place.id;
    
    return (
      <TouchableOpacity
        key={place.id}
        style={styles.placeCard}
        onPress={() => togglePlace(place.id)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#1a5e1a', '#2E7D32']}
          style={styles.placeHeader}
        >
          <View style={styles.placeNumber}>
            <Text style={styles.placeNumberText}>{place.id}</Text>
          </View>
          <View style={styles.placeTitleContainer}>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeArabicName}>{place.arabicName}</Text>
          </View>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="white" 
          />
        </LinearGradient>

        {isExpanded && (
          <View style={styles.placeContent}>
            {/* Image Placeholder */}
            <ImagePlaceholder imageName={place.image} title={place.name} />
            
            <Text style={styles.placeDescription}>{place.description}</Text>
            
            {/* Historical Significance */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Historical Significance</Text>
              <Text style={styles.infoText}>{place.historicalSignificance}</Text>
            </View>

            {/* Spiritual Significance */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Spiritual Significance</Text>
              <Text style={styles.infoText}>{place.spiritualSignificance}</Text>
            </View>

            {/* Location Details */}
            <View style={styles.locationSection}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.locationText}>{place.location}</Text>
            </View>

            {/* Special Features */}
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Special Features</Text>
              {place.specialFeatures.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Recommended Activities */}
            <View style={styles.activitiesSection}>
              <Text style={styles.sectionTitle}>Recommended Activities</Text>
              {place.recommendedActivities.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                  <Text style={styles.activityText}>{activity}</Text>
                </View>
              ))}
            </View>

            {/* Visiting Tips */}
            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>Visiting Tips</Text>
              {place.visitingTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Ionicons name="bulb-outline" size={14} color="#2196F3" />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Duas */}
            <View style={styles.duasSection}>
              <Text style={styles.sectionTitle}>Recommended Duas</Text>
              {place.duas.map((dua, index) => (
                <View key={index} style={styles.duaContainer}>
                  <Text style={styles.duaArabic}>{dua.arabic}</Text>
                  <Text style={styles.duaTransliteration}>{dua.transliteration}</Text>
                  <Text style={styles.duaTranslation}>"{dua.translation}"</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderGuideSection = (guideData, type) => (
    <View style={styles.guideContainer}>
      <View style={styles.guideHeader}>
        <View style={styles.guideInfo}>
          <Text style={styles.guideTitle}>{guideData.title}</Text>
          <Text style={styles.guideDescription}>{guideData.description}</Text>
          <View style={styles.guideMeta}>
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={14} color="white" />
              <Text style={styles.durationText}>{guideData.duration}</Text>
            </View>
            <View style={styles.typeBadge}>
              <Ionicons name="information-circle" size={14} color="white" />
              <Text style={styles.typeText}>{guideData.type}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => shareGuide(type)}
        >
          <Ionicons name="share-outline" size={20} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Requirements */}
      {guideData.requirements && (
        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>Requirements</Text>
          {guideData.requirements.map((requirement, index) => (
            <View key={index} style={styles.requirementItem}>
              <Ionicons name="person" size={14} color="#2E7D32" />
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Quick Tips */}
      <QuickTips 
        tips={type === 'hajj' ? hajjTips : umrahTips} 
        title="Quick Tips" 
      />

      {/* Common Mistakes */}
      <CommonMistakes 
        mistakes={type === 'hajj' ? hajjMistakes : umrahMistakes} 
        title="Common Mistakes to Avoid" 
      />

      {/* Steps */}
      <Text style={styles.stepsTitle}>Step-by-Step Guide</Text>
      {guideData.steps.map((step, index) => 
        renderStepCard(step, index, guideData.steps.length, type)
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#1a5e1a', '#2E7D32']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Hajj & Umrah Guide</Text>
        <Text style={styles.headerSubtitle}>Complete Step-by-Step Guidance with Duas</Text>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'hajj' && styles.activeTab]}
          onPress={() => setActiveTab('hajj')}
        >
          <Ionicons 
            name="business" 
            size={20} 
            color={activeTab === 'hajj' ? '#2E7D32' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'hajj' && styles.activeTabText]}>
            Hajj Guide
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'umrah' && styles.activeTab]}
          onPress={() => setActiveTab('umrah')}
        >
          <Ionicons 
            name="walk" 
            size={20} 
            color={activeTab === 'umrah' ? '#2E7D32' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'umrah' && styles.activeTabText]}>
            Umrah Guide
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'places' && styles.activeTab]}
          onPress={() => setActiveTab('places')}
        >
          <Ionicons 
            name="location" 
            size={20} 
            color={activeTab === 'places' ? '#2E7D32' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'places' && styles.activeTabText]}>
            Holy Places
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        style={[styles.content, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'hajj' && renderGuideSection(hajjData, 'hajj')}
        
        {activeTab === 'umrah' && renderGuideSection(umrahData, 'umrah')}

        {activeTab === 'places' && (
          <View style={styles.placesContainer}>
            <Text style={styles.placesTitle}>Important Holy Places</Text>
            <Text style={styles.placesSubtitle}>
              Sacred sites with historical significance, recommended practices, and spiritual guidance
            </Text>
            
            {importantPlaces.map(place => renderPlaceCard(place))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    padding: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#E8F5E8',
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  guideContainer: {
    marginBottom: 20,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  guideInfo: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  guideMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    marginLeft: 8,
  },
  requirementsContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  progressContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: '#FFF9C4',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  mistakesContainer: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  mistakesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    marginBottom: 8,
  },
  mistakeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mistakeText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  stepCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepTitleContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  stepSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  stepContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  stepDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  timingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#E8F5E8',
    borderRadius: 6,
  },
  timingText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 6,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  imageText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  imageSubtext: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  arabicContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  arabicText: {
    fontSize: 18,
    color: '#2E7D32',
    textAlign: 'right',
    lineHeight: 28,
    marginBottom: 4,
  },
  transliterationText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  translationText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 16,
  },
  duaContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#4CAF50',
  },
  duaArabic: {
    fontSize: 16,
    color: '#2E7D32',
    textAlign: 'right',
    lineHeight: 24,
    marginBottom: 4,
  },
  duaTransliteration: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  duaTranslation: {
    fontSize: 11,
    color: '#444',
    lineHeight: 14,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  noteText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  prohibitedContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  prohibitedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D32F2F',
    marginBottom: 8,
  },
  prohibitedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  prohibitedText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  historyContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  historyText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 16,
  },
  practicesContainer: {
    marginTop: 8,
  },
  practicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  practiceText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  circuitDuasContainer: {
    marginTop: 8,
  },
  circuitDuasTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  circuitDuaItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#F3E5F5',
    borderRadius: 6,
  },
  circuitDuaPosition: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7B1FA2',
    marginBottom: 4,
  },
  circuitDuaArabic: {
    fontSize: 14,
    color: '#7B1FA2',
    textAlign: 'right',
    lineHeight: 20,
    marginBottom: 2,
  },
  circuitDuaTranslation: {
    fontSize: 10,
    color: '#444',
    lineHeight: 12,
  },
  benefitsContainer: {
    marginTop: 8,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  benefitText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  farewellContainer: {
    marginTop: 8,
  },
  farewellTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  farewellDuaItem: {
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
  },
  farewellArabic: {
    fontSize: 16,
    color: '#2E7D32',
    textAlign: 'right',
    lineHeight: 24,
    marginBottom: 4,
  },
  farewellTransliteration: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  farewellTranslation: {
    fontSize: 11,
    color: '#444',
    lineHeight: 14,
  },
  placesContainer: {
    marginBottom: 20,
  },
  placesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  placesSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  placeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  placeNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  placeNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeTitleContainer: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  placeArabicName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  placeContent: {
    padding: 16,
  },
  placeDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  featuresSection: {
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  activitiesSection: {
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  activityText: {
    fontSize: 12,
    color: '#444',
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  tipsSection: {
    marginBottom: 12,
  },
  duasSection: {
    marginTop: 8,
  },
  bottomPadding: {
    height: 20,
  },
});

export default HajjUmrahGuide;