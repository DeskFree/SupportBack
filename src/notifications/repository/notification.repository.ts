// src/notifications/repositories/notification.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
import { UserRole } from '../schemas/notification.schema';
import { CreateNotificationDto } from '../dto/notificationCreateDto';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const createdNotification = new this.notificationModel(createNotificationDto);
    return createdNotification.save();
  }

  async read():Promise<Notification[]>{
    return this.notificationModel.find().exec()
  }

  async findAllByUserIdAndRole(userId: string, userRole: UserRole): Promise<Notification[]> {
    return this.notificationModel.find({
      $or: [
        { userId }, // Notifications specific to the user
        { targetRoles: { $in: [userRole] } }, // Notifications for the user's role
        { targetRoles: { $size: 0 } }, // Common notifications (targetRoles is empty)
      ],
    }).exec();
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
  }
}