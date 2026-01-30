import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

export async function lightHaptic() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function successHaptic() {
  await Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success
  );
}

export async function playTickSound() {
  if (!sound) {
    sound = new Audio.Sound();
    await sound.loadAsync(
      require("../../assets/sounds/tick.wav")

    );
  }
  await sound.replayAsync();
}
