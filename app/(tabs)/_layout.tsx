import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#0E1A14" },
        headerTintColor: "#F5F5DC",

        tabBarStyle: {
          backgroundColor: "#0E1A14",
          borderTopColor: "#1E3A30",
        },

        tabBarActiveTintColor: "#1F7A4D",
        tabBarInactiveTintColor: "#9FB3AA",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="tracker" options={{ title: "Tracker", tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar", tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="stats" options={{ title: "Stats", tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="summary" options={{ title: "Summary", tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
