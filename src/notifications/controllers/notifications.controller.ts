// src/notifications/controllers/notification.controller.ts
import { Controller, Post, Body, Get, Param, Patch, Req } from '@nestjs/common';
import { NotificationService } from '../service/notifications.service';
import { CreateNotificationDto } from '../dto/notificationCreateDto';
import { Notification } from '../schemas/notification.schema';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get()
  async readAllNotifications():Promise<Notification[]>{
    return this.notificationService.readAllNotifications()
  }

  @Get('my-notifications')
  async findAllByUser(@Req() req) {
    const userId = req.user.userId; // Extract userId from the request (e.g., JWT token)
    const userRole = req.user.role; // Extract userRole from the request
    return this.notificationService.getNotificationsByUserIdAndRole(userId, userRole);
  }

  @Patch(':id/mark-as-read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markNotificationAsRead(id);
  }
}