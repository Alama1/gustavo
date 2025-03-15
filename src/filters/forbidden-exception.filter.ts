import { NormalException } from '@expections/index';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ForbiddenExceptionFilter.name);

  catch(exception: ForbiddenException, host: ArgumentsHost) {
    this.logger.error(exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response
      .status(HttpStatus.FORBIDDEN)
      .send(NormalException.HTTP_FORBIDDEN(exception?.message).toJSON());
  }
}
