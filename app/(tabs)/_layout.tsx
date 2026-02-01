import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        // ✅ THIS IS THE FIX
        sceneContainerStyle: {
          paddingTop:
            Platform.OS === "android"
              ? insets.top + 8
              : insets.top,
        },

        tabBarStyle: {
          backgroundColor: "#0E1A14",
          borderTopColor: "#1F7A4D",
        },
        tabBarActiveTintColor: "#1F7A4D",
        tabBarInactiveTintColor: "#4B6B5F",

        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "index":
              iconName = "home";
              break;
            case "tracker":
              iconName = "checkmark-circle";
              break;
            case "calendar":
              iconName = "calendar";
              break;
            case "stats":
              iconName = "bar-chart";
              break;
            case "ai-chat":
              iconName = "chatbubble-ellipses";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="tracker" options={{ title: "Tracker" }} />
      <Tabs.Screen name="calendar" options={{ title: "Calendar" }} />
      <Tabs.Screen name="stats" options={{ title: "Stats" }} />
      <Tabs.Screen name="ai-chat" options={{ title: "AI" }} />
    </Tabs>
  );
}
