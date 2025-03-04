// src/notifications/notification.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {Notification, NotificationSchema } from './schemas/notification.schema';
import { NotificationRepository } from './repository/notification.repository';
import { NotificationController } from './controllers/notifications.controller';
import { NotificationService } from './service/notifications.service';
import { EmailService } from 'src/email/email.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema }
    ]),
    UserModule
  ],
  exports: [NotificationService],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository,EmailService],
})
export class NotificationModule {}