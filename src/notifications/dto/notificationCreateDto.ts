// src/notifications/dto/create-notification.dto.ts
import { UserRole } from '../schemas/notification.schema';

export class CreateNotificationDto {
   userId?: string; // Optional: ID of the user who will receive the notification
   targetRoles?: UserRole[]; // Optional: Roles that should receive the notification
   ticketId: string; // ID of the related ticket
   title:string;
   message: string; // Notification message
}