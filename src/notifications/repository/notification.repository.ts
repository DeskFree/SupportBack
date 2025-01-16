// src/notifications/repositories/notification.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notification.schema';
import { CreateNotificationDto } from '../dto/notificationCreateDto';
import { UserRole } from '../enum/notifications.enum';
import { UpdateNotificationDto } from '../dto/notificationUpdate.dto';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const createdNotification = new this.notificationModel(
      createNotificationDto,
    );
    return createdNotification.save();
  }

  async read(): Promise<Notification[]> {
    return this.notificationModel.find();
  }

  async findAllByUserIdAndRole(
    userId: string,
    userRole: UserRole,
  ): Promise<Notification[]> {
    return this.notificationModel.find({
      $or: [
        { userId }, // Notifications specific to the user
        { targetRoles: { $in: [userRole] } }, // Notifications for the user's role
        { targetRoles: { $size: 0 } }, // Common notifications (targetRoles is empty)
      ],
    });
  }

  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<Notification> {
    // Update the notification
    const updatedNotification = await this.notificationModel
      .findByIdAndUpdate(
        notificationId,
        {
          $addToSet: { readedUsers: userId }, // Add the user ID to the `readedUsers` array
        },
        { new: true }, // Return the updated document
      )

    if (!updatedNotification) {
      throw new NotFoundException('Notification not found');
    }

    return updatedNotification;
  }

  async update(notificationId: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      updateNotificationDto,
      { new: true }, // Return the updated document
    )
  }

  async delete(notificationId: string): Promise<Notification> {
    return this.notificationModel.findByIdAndDelete(notificationId);
  }

}
