// src/notifications/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true }) // Adds `createdAt` and `updatedAt` fields automatically
export class Notification {
  @Prop({ required: true })
  userId: string; // ID of the user who will receive the notification

  @Prop({ required: true })
  ticketId: string; // ID of the related ticket

  @Prop({ required: true })
  message: string; // Notification message

  @Prop({ default: false })
  isRead: boolean; // Whether the notification has been read

  @Prop({ default: Date.now })
  createdAt: Date; // Timestamp when the notification was created
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);