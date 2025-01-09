import { Injectable } from '@nestjs/common';
import { LogActions } from './enum/log-actions.enum';
import { Log } from './schemas/log.schema';
import { LogRepository } from './repository/log.repository';
import { CreateLogDto } from './dto/create-log.dto';
import { targetModels } from './enum/log-models.enum';
import { LogModule } from './log.module';

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  createLog(newLog: CreateLogDto): Promise<Log> {
    return this.logRepository.createLog(newLog);
  }

  getAllLogs(): Promise<Log[]> {
    return this.logRepository.getLogs({});
  }

  getLogsByAction(action: LogActions): Promise<Log[]> {
    return this.logRepository.getLogs({ action });
  }

  getLogsByTargetModel(targetModel: LogActions): Promise<Log[]> {
    return this.logRepository.getLogs({ targetModel });
  }

  getLogsByTargetId(targetId: LogActions): Promise<Log[]> {
    return this.logRepository.getLogs({ targetId });
  }

  async clearLogs(): Promise<Log> {
    await this.logRepository.clearLogs();
  
    const clearedLog: CreateLogDto = {
      userId: null,// will get
      action: LogActions.CLEAR,
      targetId: null, //null cuz all docs has been clear
      targetModel: targetModels.LOG,
      details: 'All logs have been cleared.',
    };
  
    return this.createLog(clearedLog);
  }
  
}
