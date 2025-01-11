import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseRollBackException extends HttpException {
  constructor(message: string = 'Database operation failed') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}