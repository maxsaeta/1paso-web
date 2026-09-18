import { Platform } from 'react-native';

let Notifications: any = null;
if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export const isPushNotificationsAvailable = (): boolean => Platform.OS !== 'web';

export const registerForPushNotifications = async (): Promise<string | null> => {
  if (Platform.OS === 'web') return null;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permisos de notificación no concedidos');
      return null;
    }

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: '459204323613',
    });

    console.log('Push token:', token.data);
    return token.data;
  } catch (error) {
    console.error('Error registering for notifications:', error);
    return null;
  }
};

export const scheduleTimerNotification = async (
  seconds: number,
  title: string,
  body: string
): Promise<string | null> => {
  if (Platform.OS === 'web') return null;
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
      },
    });
    return id;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return null;
  }
};

export const cancelNotification = async (notificationId: string): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

export const addNotificationListener = (handler: (notification: any) => void) => {
  if (Platform.OS === 'web') return { remove: () => {} };
  return Notifications.addNotificationReceivedListener(handler);
};

export const addNotificationResponseListener = (handler: (response: any) => void) => {
  if (Platform.OS === 'web') return { remove: () => {} };
  return Notifications.addNotificationResponseReceivedListener(handler);
};