// src/notifications/dto/create-notification.dto.ts
import { notiType, UserRole } from "../enum/notifications.enum";

export class CreateNotificationDto {
   userId?: string; // Optional: ID of the user who will receive the notification
   targetRoles?: UserRole[]; // Optional: Roles that should receive the notification
   referenceID: string; // ID of the related ticket or forum
   title:string;
   message: string; // Notification message
   type:notiType;
}