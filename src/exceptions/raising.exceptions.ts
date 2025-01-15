import { HttpException, HttpStatus } from '@nestjs/common';

export class TicketNotFoundException extends HttpException {
  constructor(id: string) {
    super(`Ticket with ID ${id} not found`, HttpStatus.NOT_FOUND);
  }
}

export class DuplicateTicketException extends HttpException {
  constructor(ticket_id: string) {
    super(`Ticket with ID ${ticket_id} already exists`, HttpStatus.CONFLICT);
  }
}

export class InvalidDocumentException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}