// src/notifications/services/notification.service.ts
import { Injectable } from '@nestjs/common';
import { UserRole } from '../schemas/notification.schema';
import { CreateNotificationDto } from '../dto/notificationCreateDto';
import { NotificationRepository } from '../repository/notification.repository';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly emailService: EmailService, // Inject the EmailService
  ) {}
  async createNotification(createNotificationDto: CreateNotificationDto) {
    // Save the notification to the database
    const notification = await this.notificationRepository.create(createNotificationDto);

    // Send an email notification
    const emailSubject = 'New Notification';
    const emailText = `You have a new notification: ${createNotificationDto.message}`;
    await this.emailService.sendEmail('user@example.com', emailSubject, emailText); // Replace with the user's email

    return notification;
  }

  async getNotificationsByUserIdAndRole(userId: string, userRole: UserRole) {
    return this.notificationRepository.findAllByUserIdAndRole(userId, userRole);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.notificationRepository.markAsRead(notificationId);
  }

  async readAllNotifications(){
    return await this.notificationRepository.read()
  }
}