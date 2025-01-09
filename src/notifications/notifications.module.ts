// src/notifications/notification.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {Notification, NotificationSchema } from './schemas/notification.schema';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationController } from './controllers/notifications.controller';
import { NotificationService } from './service/notifications.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Notification.name, schema: NotificationSchema }
  ])],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository],
})
export class NotificationModule {}