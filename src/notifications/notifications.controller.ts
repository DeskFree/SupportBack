import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './Notification.model';

@Controller('notifications')
export class NotificationsController {

    constructor(private notificationService:NotificationsService){

    }

    @Get()
    getAllNotifications(){
       return this.notificationService.getAllNotifications();
    }

    @Post()
    createNotification(
        @Body('title') title:string,
        @Body('message') message:string,
        @Body('isRead') isRead:boolean,
        @Body('type') type:NotificationType,
        @Body('userId') userId:string
    ){
        this.notificationService.createNotification(title,message,isRead,type,userId);
    }

}
