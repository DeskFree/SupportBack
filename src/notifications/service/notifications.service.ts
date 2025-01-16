// src/notifications/services/notification.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from '../dto/notificationCreateDto';
import { NotificationRepository } from '../repository/notification.repository';
import { EmailService } from 'src/email/email.service';
import { UserRole } from '../enum/notifications.enum';
import { UserService } from 'src/user/user.service';
import { UpdateNotificationDto } from '../dto/notificationUpdate.dto';

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private emailService: EmailService, // Inject the EmailService
    private userService: UserService,
  ) {}
  async createNotification(createNotificationDto: CreateNotificationDto) {
    // Save the notification to the database
    const notification = await this.notificationRepository.create(
      createNotificationDto,
    );

    let emails: string[] = ['minidu@Mail.com'];
    console.log(createNotificationDto.userIds)
    createNotificationDto.userIds.forEach(async (id) => {
      if (id) {
        // Fetch email for a single user
        const user = await this.userService.findById(id);
        if (user && user.email) {
          emails.push(user.email);
        }
      }
    });

    if (emails.length > 0) {
      const emailSubject = createNotificationDto.title;
      const emailText = createNotificationDto.message;
      await this.emailService.sendEmail(
        emails, // Array of email addresses
        emailSubject,
        emailText,
      );
    }

    return notification;
  }

  async getNotificationsByUserIdAndRole(userId: string, userRole: UserRole) {
    return this.notificationRepository.findAllByUserIdAndRole(userId, userRole);
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    return this.notificationRepository.markAsRead(notificationId,userId);
  }

  async readAllNotifications() {
    return  await this.notificationRepository.read();
  }

  async updateNotification(notificationId: string, updateNotificationDto: UpdateNotificationDto) {
    const updatedNotification = await this.notificationRepository.update(
      notificationId,
      updateNotificationDto,
    );
    if (!updatedNotification) {
      throw new NotFoundException('Notification not found');
    }
    return updatedNotification;
  }

  async deleteNotification(notificationId: string) {
    return this.notificationRepository.delete(notificationId);
  }
}
