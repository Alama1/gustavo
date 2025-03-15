import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { NormalException } from '@expections/index';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BadRequestExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    this.logger.error(exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response
      .status(HttpStatus.BAD_REQUEST)
      .send(NormalException.BAD_REQUEST(exception?.message).toJSON());
  }
}
