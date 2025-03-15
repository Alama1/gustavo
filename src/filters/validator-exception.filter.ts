import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { NormalException } from '@expections/index';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: ValidationError, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const extractConstraints = (error: ValidationError): string[] => {
      if (error.constraints) {
        return Object.values(error.constraints);
      }
      if (error.children && error.children.length > 0) {
        return error.children.flatMap((child) => extractConstraints(child));
      }
      return [];
    };

    const errorMessages = extractConstraints(exception);

    response
      .status(422)
      .send(NormalException.VALIDATION_ISSUE(errorMessages).toJSON());
  }
}
