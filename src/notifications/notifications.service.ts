import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {

    private notifications= ["hi"];

    getAllNotifications(){
        return this.notifications;
    }


}
