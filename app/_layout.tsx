import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DayProvider } from "../src/context/DayContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DayProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </DayProvider>
    </SafeAreaProvider>
  );
}
