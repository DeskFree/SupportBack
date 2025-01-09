// src/notifications/services/notification.service.ts
import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../repository/notification.repository';
import { CreateNotificationDto } from '../dto/notificationCreateDto';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    return this.notificationRepository.create(createNotificationDto);
  }

  async getNotificationsByUserId(userId: string) {
    return this.notificationRepository.findAllByUserId(userId);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.notificationRepository.markAsRead(notificationId);
  }
}