// src/notifications/services/notification.service.ts
import { Injectable } from '@nestjs/common';
import { UserRole } from '../schemas/notification.schema';
import { CreateNotificationDto } from '../dto/notificationCreateDto';
import { NotificationRepository } from '../repository/notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    return this.notificationRepository.create(createNotificationDto);
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