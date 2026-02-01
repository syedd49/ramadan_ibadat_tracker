import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0E1A14",
  },
  container: {
    flex: 1,
    paddingTop: 16, // ✅ STANDARD TOP SPACING (FINAL FIX)
  },
});
