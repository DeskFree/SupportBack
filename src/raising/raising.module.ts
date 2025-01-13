import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RaisingRepository } from './repository/raising.repository';
import { RaisingController } from './raising.controller';
import { RaisingService } from './raising.service';
import { RaisingSchema, Raising } from './schemas/raising.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Raising.name, schema: RaisingSchema }])],
    controllers: [RaisingController],
    providers: [RaisingService, RaisingRepository],
})
export class RaisingModule { }
