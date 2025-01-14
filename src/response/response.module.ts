import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseService } from './service/response.service';
import { ResponseRepository } from './repository/response.repository';
import { Response, ResponseSchema } from './schemas/response.schema';
import { ResponseController } from './controllers/response.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Response.name, schema: ResponseSchema }]),
  ],
  controllers: [ResponseController],
  providers: [ResponseService, ResponseRepository],
})
export class ResponseModule {}
