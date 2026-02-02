import { Stack } from "expo-router";

export default function AILayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#0E1B16" },
        headerTintColor: "#F5F5DC",
      }}
    />
  );
}
