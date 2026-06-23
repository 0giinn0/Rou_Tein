import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

export async function scheduleDailyReminder(hour = 9, minute = 0) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Keep your streak alive! 🔥",
      body: "Complete today's challenges and stay on track with Rou_Tein.",
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    } as Notifications.NotificationTriggerInput,
  });
}

export async function scheduleStreakWarning(hour = 20, minute = 0) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Don't lose your streak! ⚠️",
      body: "You haven't completed today's challenges yet. Finish strong!",
      sound: true,
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    } as Notifications.NotificationTriggerInput,
  });
}

export async function clearScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
