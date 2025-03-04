import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ForumModule } from './forum/forum.module';
import * as dotenv from 'dotenv';
import { NotificationModule } from './notifications/notifications.module';
import { EmailService } from './email/email.service';
import { RaisingModule } from './raising/raising.module';
import { ResponseModule } from './response/response.module';
dotenv.config();

console.log('MONGO_URI:', process.env.MONGO_URI);

@Module({
  imports: [
    // added config file to nestjs
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    // added mongoose module to nest
    MongooseModule.forRoot(process.env.MONGO_URI),

    //other modules
    UserModule,

    AuthModule,

    NotificationModule,
    ForumModule,
    RaisingModule,
    ResponseModule
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule { }
