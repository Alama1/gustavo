import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { NormalException } from '@expections/index';

@Catch(ConflictException)
export class ConflictExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ConflictException.name);

  catch(exception: ConflictException, host: ArgumentsHost) {
    this.logger.error(exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response
      .status(HttpStatus.CONFLICT)
      .send(NormalException.HTTP_CONFLICT(exception?.message).toJSON());
  }
}
