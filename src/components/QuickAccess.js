import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSettings } from "../contexts/SettingsContext";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const items = [
  { key: "Qibla", screen: "QiblaScreen", icon: "compass-outline" },
  { key: "Tasbih", screen: "TasbihScreen", icon: "ellipse-outline" },
  { key: "Duas", screen: "DuasScreen", icon: "book-outline" },
  { key: "Hadith", screen: "HadithScreen", icon: "document-text-outline" },
];

const QuickAccess = () => {
  const navigation = useNavigation();
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  return (
    <View style={[styles.wrapper, isDark && styles.darkWrapper]}>
      <Text style={[styles.title, isDark && styles.darkTitle]}>Quick Access</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.card, isDark && styles.darkCard]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={24} color="#16a34a" />
            </View>
            <Text style={[styles.cardText, isDark && styles.darkCardText]}>{item.key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  darkWrapper: {
    // Dark mode styles if needed
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  darkTitle: {
    color: "#f1f5f9",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: (width - 48) / 2 - 8, // Calculate width for 2 columns with spacing
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  darkCard: {
    backgroundColor: "#1e293b",
    borderColor: "#334155",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    textAlign: "center",
  },
  darkCardText: {
    color: "#f1f5f9",
  },
});

export default QuickAccess;