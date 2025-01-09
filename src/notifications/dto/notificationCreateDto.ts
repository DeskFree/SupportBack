// src/notifications/dto/create-notification.dto.ts
export class CreateNotificationDto {
    readonly userId: string;
    readonly ticketId: string;
    readonly message: string;
  }