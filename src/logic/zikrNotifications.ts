import Constants from "expo-constants";
import { suggestZikr, TimeSlot, Mood } from "./zikrAI";

/**
 * Expo Go does NOT support notifications (SDK 53+ Android)
 */
const isExpoGo = Constants.appOwnership === "expo";

type Prayer =
  | "Fajr"
  | "Dhuhr"
  | "Asr"
  | "Maghrib"
  | "Isha";

const prayerToTimeSlot: Record<Prayer, TimeSlot> = {
  Fajr: "afterFajr",
  Dhuhr: "afterDhuhr",
  Asr: "afterAsr",
  Maghrib: "afterMaghrib",
  Isha: "afterIsha",
};

export async function sendPostPrayerZikrNotification(
  prayer: Prayer,
  mood?: Mood
) {
  // 🚫 Skip completely in Expo Go
  if (isExpoGo) {
    console.log(
      "[ZikrNotification] Skipped (Expo Go does not support notifications)"
    );
    return;
  }

  // 🔹 Dynamic import prevents Expo Go crash
  const Notifications = await import("expo-notifications");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const zikr = suggestZikr(prayerToTimeSlot[prayer], mood, 1)[0];
  if (!zikr) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🤍 Zikr Reminder",
      body: `${zikr.arabic}\n${zikr.roman}`,
      data: {
        zikrId: zikr.id,
        prayer,
      },
    },
    trigger: null,
  });
}
