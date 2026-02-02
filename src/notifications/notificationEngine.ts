import { generateNotificationText } from "../ai/notificationText";

export function buildPrayerNotification(params: {
  salah: string;
  missedRecently: boolean;
}) {
  return {
    title: "Ramadan Reminder",
    body: generateNotificationText(params),
  };
}
