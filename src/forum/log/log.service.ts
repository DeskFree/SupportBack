import { Injectable } from '@nestjs/common';
import { Log } from './schemas';
import { LogRepository } from './repository';
import { CreateLogDto } from './dto';
import { targetModels, LogActions } from '../enums';
import { LogFailureException } from 'src/exceptions';

@Injectable()
export class LogService {
  constructor(private readonly logRepository: LogRepository) {}

  async createLog(
    newLog: CreateLogDto,
    rollbackFunction?: () => Promise<any>,
  ): Promise<Log> {
    try {
      // Attempt to create the log
      const log = await this.logRepository.createLog(newLog);
      return log;
    } catch (error) {
      if (rollbackFunction) {
        try {
          await rollbackFunction();
        } catch (rollbackError) {
          console.error('Rollback failed:', rollbackError);
          throw new LogFailureException(
            `Failed to record the creation of the log entry and rollback the database transaction. Original error: ${error.message}, Rollback error: ${rollbackError.message}`,
          );
        }
      }
      throw new LogFailureException(
        `Failed to record the creation of the ${newLog.targetModel.toLowerCase()}. Error details: ${error.message}.`,
      );
    }
  }

  getAllLogs(): Promise<Log[]> {
    return this.logRepository.getLogs({}).catch((error) => {
      throw new LogFailureException(
        `Failed to retrieve all logs. Error details: ${error.message}.`,
      );
    });
  }

  getLogsByAction(action: LogActions): Promise<Log[]> {
    return this.logRepository.getLogs({ action }).catch((error) => {
      throw new LogFailureException(
        `Failed to retrieve logs with action ${action}. Error details: ${error.message}.`,
      );
    });
  }

  getLogsByTargetModel(targetModel: LogActions): Promise<Log[]> {
    return this.logRepository.getLogs({ targetModel }).catch((error) => {
      throw new LogFailureException(
        `Failed to retrieve logs with target model ${targetModel}. Error details: ${error.message}.`,
      );
    });
  }

  getLogsByTargetId(targetId: LogActions): Promise<Log[]> {
    return this.logRepository.getLogs({ targetId }).catch((error) => {
      throw new LogFailureException(
        `Failed to retrieve logs with target ID ${targetId}. Error details: ${error.message}.`,
      );
    });
  }

  async clearLogs(): Promise<Log> {
    await this.logRepository.clearLogs().catch((error) => {
      throw new LogFailureException(
        `Failed to clear all logs. Error details: ${error.message}.`,
      );
    });

    const clearedLog: CreateLogDto = {
      userId: null, // will get
      action: LogActions.CLEAR,
      targetId: null, //null cuz all docs has been clear
      targetModel: targetModels.LOG,
      details: 'All logs have been cleared.',
    };

    return this.createLog(clearedLog).catch((error) => {
      throw new LogFailureException(
        `Failed to record the clearing of all logs. Error details: ${error.message}.`,
      );
    });
  }
}
