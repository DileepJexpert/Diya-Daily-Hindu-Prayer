/**
 * Daily practice reminders via expo-notifications. A single repeating local
 * notification at the user's chosen time — no server or push credentials needed.
 */
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const MESSAGES = [
  'Time to light your diya 🪔',
  'A few minutes of stillness await',
  'Your daily sadhana is ready',
  'Pause, breathe, and begin',
];

export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted) return true;
    const req = await Notifications.requestPermissionsAsync();
    return req.granted;
  } catch {
    return false;
  }
}

export async function scheduleDailyReminder(hour: number, minute: number): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const ok = await ensureNotificationPermission();
  if (!ok) return false;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Diya',
        body: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function cancelReminders(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    /* noop */
  }
}
