import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { NormalException } from '@expections/index';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnauthorizedExceptionFilter.name);

  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    this.logger.error(exception.stack);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response
      .status(HttpStatus.UNAUTHORIZED)
      .send(NormalException.HTTP_UNAUTHORIZED(exception?.message).toJSON());
  }
}
