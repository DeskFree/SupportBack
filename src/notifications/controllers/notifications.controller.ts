// src/notifications/controllers/notification.controller.ts
import { Controller, Post, Body, Get, Param, Patch, Req, Delete } from '@nestjs/common';
import { NotificationService } from '../service/notifications.service';
import { CreateNotificationDto } from '../dto/notificationCreateDto';
import { Notification } from '../schemas/notification.schema';
import { UserRole } from '../enum/notifications.enum';
import { UpdateNotificationDto } from '../dto/notificationUpdate.dto';

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
  // async findAllByUser(@Req() req) { //uncomment this line before implementing
  async findAllByUser() { //remove this line before implementing
    const req = {user:{userId:'1234',role:'system_admin'}} //remove this line before implementing
    const userId = req.user.userId; // Extract userId from the request (e.g., JWT token)
    const userRole: UserRole = req.user.role as UserRole; // Extract userRole from the request and cast to UserRole
    return this.notificationService.getNotificationsByUserIdAndRole(userId, userRole);
  }

  @Patch(':id/mark-as-read')
  async markAsRead(@Param('id') id: string, @Req() req1) {
    const req = {user:{userId:'1234'}} //remove this line before implementing
    const userId = req.user.userId; // Extract userId from the request (e.g., JWT token)
    return this.notificationService.markNotificationAsRead(id,userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.updateNotification(id, updateNotificationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.notificationService.deleteNotification(id);
  }

}