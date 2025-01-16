// src/notifications/dto/update-notification.dto.ts
import { PartialType } from '@nestjs/mapped-types';

import { CreateNotificationDto } from "./notificationCreateDto";

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}