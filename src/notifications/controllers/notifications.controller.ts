// src/notifications/controllers/notification.controller.ts
import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from '../service/notifications.service';
import { CreateNotificationDto } from '../dto/notificationCreateDto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get(':userId')
  async findAllByUserId(@Param('userId') userId: string) {
    return this.notificationService.getNotificationsByUserId(userId);
  }

  @Patch(':id/mark-as-read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markNotificationAsRead(id);
  }
}