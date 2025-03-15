import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { NormalException } from '@expections/index';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NotFoundExceptionFilter.name);

  catch(exception: NotFoundException, host: ArgumentsHost) {
    this.logger.error(exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response
      .status(HttpStatus.NOT_FOUND)
      .send(NormalException.HTTP_NOT_FOUND(exception?.message).toJSON());
  }
}
