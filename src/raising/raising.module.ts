import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RaisingRepository } from './repository/raising.repository';
import { Raising, RaisingSchema } from './schemas/raising.schema';
import { RaisingController } from './raising.controller';
import { RaisingService } from './raising.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Raising.name, schema: RaisingSchema }])],
    controllers: [RaisingController],
    providers: [RaisingService, RaisingRepository],
})
export class RaisingModule { }
