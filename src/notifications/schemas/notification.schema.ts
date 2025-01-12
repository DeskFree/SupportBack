// src/notifications/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { notiType, UserRole } from '../enum/notifications.enum';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  userId: string; // ID of the user who will receive the notification (if specific)

  @Prop({ type: [String], default: [] })
  targetRoles: UserRole[]; // Roles that should receive the notification (if empty, common to all)

  @Prop({ required: true })
  referenceID: string; // ID of the related ticket

  @Prop({ required: true })
  title: string; // Notification message

  @Prop({ required: true })
  message: string; // Notification message

  @Prop({ default: false })
  isRead: boolean; // Whether the notification has been read

  @Prop()
  type:notiType
}


export const NotificationSchema = SchemaFactory.createForClass(Notification);