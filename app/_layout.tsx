import { Stack } from "expo-router";
import { useEffect } from "react";

import { LanguageProvider } from "../src/context/LanguageContext";
import { DayProvider } from "../src/context/DayContext";
import { migrateTasbeehDatasetOnce } from "../src/tasbeeh/migrateTasbeehDataset";

export default function RootLayout() {
  /* 🔁 ONE-TIME DATASET MIGRATION */
  useEffect(() => {
    migrateTasbeehDatasetOnce();
  }, []);

  return (
    <LanguageProvider>
      <DayProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </DayProvider>
    </LanguageProvider>
  );
}
