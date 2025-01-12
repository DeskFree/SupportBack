// src/notifications/services/notification.service.ts
import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../dto/notificationCreateDto';
import { NotificationRepository } from '../repository/notification.repository';
import { EmailService } from 'src/email/email.service';
import { UserRole } from '../enum/notifications.enum';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private emailService: EmailService, // Inject the EmailService
  ) {}
  async createNotification(createNotificationDto: CreateNotificationDto) {
    // Save the notification to the database
    const notification = await this.notificationRepository.create(
      createNotificationDto,
    );

    if (createNotificationDto.userId) {
      // Send an email notification
      const emailSubject = createNotificationDto.title;
      const emailText = createNotificationDto.message;
      // const receiver =
      await this.emailService.sendEmail(
        'user@example.com',
        emailSubject,
        emailText,
      ); // Replace with the user's email
    }

    return notification;
  }

  async getNotificationsByUserIdAndRole(userId: string, userRole: UserRole) {
    return this.notificationRepository.findAllByUserIdAndRole(userId, userRole);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.notificationRepository.markAsRead(notificationId);
  }

  async readAllNotifications() {
    return await this.notificationRepository.read();
  }
}
