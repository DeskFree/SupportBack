import { Injectable } from '@nestjs/common';
import { v1 as uuid } from 'uuid';
import { Notification, NotificationType } from './Notification.model';
import { NotificationSearchDto } from './NotificationSearch.dto';

@Injectable()
export class NotificationsService {
  private notifications: Notification[] = [];

  getAllNotifications() {
    return this.notifications;
  }

  createNotification(
    title: string, // Title of the notification
    message: string, // Main content or message
    isRead: boolean, // Whether the notification has been read
    type?: NotificationType, // Optional: Type of the notification (e.g., "info", "warning", "alert")
    userId?: string,
  ) {
    const notification = {
      id: uuid(),
      title,
      message,
      timestamp: new Date(),
      isRead: isRead || false,
      type,
      userId,
    };
    this.notifications.push(notification);
    return notification;
  }

  notificationSearch(notificaionSearchDto:NotificationSearchDto){
    const {title,message} = notificaionSearchDto;
    let notifications = this.getAllNotifications();
    notifications = notifications.filter(notification => {notification.title === title});
    notifications = notifications.filter(notification => {notification.message === message});

    return notifications;
  }

}
