import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';

class NotificationService {
  private channelId: string = 'default';

  async requestPermissions() {
    await notifee.requestPermission();
  }

  async createChannel() {
    // Android requires a channel to be created before displaying notifications
    if (Platform.OS === 'android') {
      this.channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
  }

  async setup() {
    await this.requestPermissions();
    await this.createChannel();
  }

  async showNotification(title: string, body: string) {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: this.channelId,
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
      },
    });
  }
}

export const notificationService = new NotificationService();
