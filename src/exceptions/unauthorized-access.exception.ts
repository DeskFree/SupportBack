import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedAccessException extends HttpException {
  constructor(message: string = 'Unauthorized: User must be logged in to create a problem.') {
    super(message, HttpStatus.FORBIDDEN);
  }
}