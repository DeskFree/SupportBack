import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log, LogDocument } from '../schemas';
import { Model } from 'mongoose';
import { CreateLogDto } from '../dto';
import { SearchLogDto } from '../dto/search-log.dto';

@Injectable()
export class LogRepository {
  constructor(@InjectModel(Log.name) private logModel: Model<LogDocument>) {}

  async createLog(newLog: CreateLogDto): Promise<Log> {
    return await new this.logModel(newLog).save();
  }

  async getLogs(query: SearchLogDto): Promise<Log[]> {
    return this.logModel.find(query).exec();
  }

  async clearLogs(): Promise<any> {
    return await this.logModel.deleteMany({});
  }
}
