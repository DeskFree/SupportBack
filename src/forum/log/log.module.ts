import { Global, Module } from '@nestjs/common';
import { LogService } from './log.service';
import { Log, LogSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { LogRepository } from './repository';
import { LogController } from './log.controller';
@Global()
@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [LogService, LogRepository],
  exports: [LogService],
  controllers: [LogController],
})
export class LogModule {}
