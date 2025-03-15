import { NormalException } from '@expections/index';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.error(exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response
      .status(exception?.getStatus?.() || 400)
      .send(NormalException.UNEXPECTED(exception?.message).toJSON());
  }
}
