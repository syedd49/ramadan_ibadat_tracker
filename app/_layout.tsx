import { Stack } from "expo-router";

import { LanguageProvider } from "../src/context/LanguageContext";
import { DayProvider } from "../src/context/DayContext";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <DayProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </DayProvider>
    </LanguageProvider>
  );
}
