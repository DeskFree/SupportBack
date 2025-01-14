import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RaisingRepository } from './repository/raising.repository';
import { RaisingController } from './controllers/raising.controller';
import { RaisingSchema, Raising } from './schemas/raising.schema';
import { RaisingService } from './service/raising.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Raising.name, schema: RaisingSchema }])],
    controllers: [RaisingController],
    providers: [RaisingService, RaisingRepository],
})
export class RaisingModule { }
