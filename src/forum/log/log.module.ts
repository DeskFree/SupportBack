import { Global, Module } from '@nestjs/common';
import { LogService } from './log.service';
import { Log, LogSchema } from './schemas/log.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LogRepository } from './repository/log.repository';
@Global()
@Module({
  imports:[MongooseModule.forFeature([{name:Log.name,schema:LogSchema}])],
  providers: [LogService,LogRepository],
  exports: [LogService]
})
export class LogModule {}
