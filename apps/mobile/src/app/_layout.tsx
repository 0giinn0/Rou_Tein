import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { requestNotificationPermissions, scheduleDailyReminder, scheduleStreakWarning } from "../lib/notifications";

export default function RootLayout() {
  useEffect(() => {
    async function setupNotifications() {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleDailyReminder(9, 0);
        await scheduleStreakWarning(20, 0);
      }
    }
    setupNotifications();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
