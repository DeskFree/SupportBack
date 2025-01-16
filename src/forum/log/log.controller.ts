import { Controller, Delete, Get, Query, UsePipes } from '@nestjs/common';
import { LogService } from './log.service';
import { LogActions, targetModels } from '../enums';
import { Types } from 'mongoose';
import { SearchLogDto } from './dto/search-log.dto';
import { LogValidatorPipe } from 'src/pipes';
import { ErrorHandlerUtil } from 'src/utils';

@Controller('forum/log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  async getAllLogs() {
    return this.logService.getAllLogs().catch((error) => {
      throw ErrorHandlerUtil.handleError(error);
    });
  }

  @Get('/search')
  @UsePipes(new LogValidatorPipe())
  async getLogByActions(
    @Query('action') action: LogActions,
    @Query('targetModel') targetModel: targetModels,
    @Query('targetId') targetId: Types.ObjectId,
  ) {
    return this.logService
      .searchLogs({ action, targetModel, targetId })
      .catch((error) => {
        throw ErrorHandlerUtil.handleError(error);
      });
  }

  @Delete()
  async clearLogs() {
    return this.logService.clearLogs().catch((error) => {
      throw ErrorHandlerUtil.handleError(error);
    });
  }
}
