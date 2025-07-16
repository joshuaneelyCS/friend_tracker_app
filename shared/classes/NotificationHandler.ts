import { NotificationMessage, NotificationMessages, NotificationType } from '@/shared/templates/NotificationMessages';
import * as Notifications from 'expo-notifications';
import Friend from './Friend';

export class NotificationHandler {

    static async cancelNotification(id: string) {
        if (id) {
            try {
                await Notifications.cancelScheduledNotificationAsync(id);
            } catch (e) {
                console.error("Failed to cancel old notification:", e);
            }
        }
    }

    static async scheduleNotification(
        friend: Friend, 
        daysInTheFuture: number, 
        type: NotificationType, 
        random: boolean = true,
        overrideMessage?: NotificationMessage
    ): Promise<string> {
        
        const trigger = {
            seconds: 60 * 60 * 24 * daysInTheFuture,
            repeats: false,
            type: 'timeInterval',
          } as Notifications.NotificationTriggerInput;
        
          console.log(`Scheduling '${type}' notification for`, friend.name.firstName);
        
          // 1. Use override message if provided
          let message: NotificationMessage;
          if (overrideMessage) {
            message = overrideMessage;
          } else {
            // 2. Otherwise pull from the pool
            const pool = NotificationMessages[type](friend); // e.g. notificationMessages.thirtyDayReminder(friend)
            message = random
              ? pool[Math.floor(Math.random() * pool.length)]
              : pool[0]; // or use a passed-in index if you want more control
          }
        
          const NotificationId = await Notifications.scheduleNotificationAsync({
            content: {
              title: message.title,
              body: message.body,
            },
            trigger,
          });

        friend.notificationId = NotificationId;

        return NotificationId;
    }
}