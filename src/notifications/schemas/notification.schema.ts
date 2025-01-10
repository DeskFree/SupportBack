// src/notifications/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  CLIENT = 'client',
  LEVEL_1_AGENT = 'level_1_agent',
  LEVEL_2_AGENT = 'level_2_agent',
  SYSTEM_ADMIN = 'system_admin',
}

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  userId: string; // ID of the user who will receive the notification (if specific)

  @Prop({ type: [String], enum: UserRole, default: [] })
  targetRoles: UserRole[]; // Roles that should receive the notification (if empty, common to all)

  @Prop({ required: true })
  ticketId: string; // ID of the related ticket

  @Prop({ required: true })
  message: string; // Notification message

  @Prop({ default: false })
  isRead: boolean; // Whether the notification has been read
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);