import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSettings } from "../contexts/SettingsContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const items = [
  { key: "Read Quran", screen: "DuasScreen", icon: "book-outline" },
  { key: "Qibla", screen: "QiblaScreen", icon: "compass-outline" },
  { key: "Tasbih", screen: "TasbihScreen", icon: "ellipse-outline" },
  { key: "Mosque Nearby", screen: "HadithScreen", icon: "location-outline" },
  // { key: "Zakat Calculator", screen: "Zakat Calculator", icon: "location-outline" },
];

const QuickAccess = () => {
  const navigation = useNavigation();
  const { theme } = useSettings();
  const isDark = theme === "dark";

  return (
    <LinearGradient
      colors={isDark ? ["#1e293b", "#334155"] : ["#ffffff", "#f8fafc"]}
      style={[styles.container, isDark && styles.darkContainer]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.wrapper}>
        <Text style={[styles.title, isDark && styles.darkTitle]}>Quick Access</Text>
        <View style={styles.grid}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.itemCard, isDark && styles.darkItemCard]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={26} color="#16a34a" />
              </View>
              <Text style={[styles.cardText, isDark && styles.darkCardText]}>
                {item.key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  darkContainer: {
    shadowOpacity: 0.3,
  },
  wrapper: {
    flex: 1,
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
  itemCard: {
    width: (width - 64) / 2, // 2 columns with spacing
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  darkItemCard: {
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
    marginBottom: 10,
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
