import * as Notifications from "expo-notifications";
import { detectCurrentNamaz } from "../ai/namazDetector";
import { getTasbeehSuggestion } from "../ai/tasbeehSuggestion";

export async function scheduleTasbeehReminder() {
  const namaz = detectCurrentNamaz();
  const message = getTasbeehSuggestion(namaz);

  await Notifications.requestPermissionsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Tasbeeh Reminder 📿",
      body: message,
    },
    trigger: null, // immediate (call after namaz)
  });
}
