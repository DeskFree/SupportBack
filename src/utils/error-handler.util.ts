import {
  BadRequestException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DatabaseException,
  DuplicateException,
  LogFailureException,
  TooManyRequestsException,
  UnauthorizedAccessException,
} from 'src/exceptions';

export class ErrorHandlerUtil {
  /**
   * Handles errors and maps them to appropriate HTTP exceptions.
   * @param error - The error that occurred.
   * @returns An HttpException with the appropriate status code and message.
   */
  static handleError(error: Error): HttpException {
    if (
      error instanceof BadRequestException ||
      error instanceof TooManyRequestsException ||
      error instanceof UnauthorizedAccessException ||
      error instanceof DuplicateException
    ) {
      return new BadRequestException({
        statusCode: error.getStatus(),
        message: error.message,
      });
    }
    if (error instanceof NotFoundException) {
      return new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Resource not found : ${error.message}`,
      });
    }
    if (
      error instanceof DatabaseException ||
      error instanceof LogFailureException
    ) {
      return new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    return new InternalServerErrorException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Something Went Wrong : ${error.message}`,
    });
  }
}
