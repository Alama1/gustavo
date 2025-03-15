import { HttpException, HttpStatus } from '@nestjs/common';
import { FailResponse } from '@shared/interfaces/response';

export class NormalException extends HttpException {
  constructor(message: string | string[], statusCode: number, success = false) {
    super({ message, statusCode, success }, HttpStatus.BAD_REQUEST);
  }

  static REQUEST_BODY_CANNOT_PARSE() {
    return new NormalException('Request Body Cannot Parse', 10001);
  }

  static HTTP_REQUEST_TIMEOUT() {
    return new NormalException('HTTP Request Timeout', 10002);
  }

  static HTTP_NOT_FOUND(msg = 'Not Found') {
    return new NormalException(msg, HttpStatus.NOT_FOUND);
  }

  static HTTP_CONFLICT(msg = 'Conflict') {
    return new NormalException(msg, HttpStatus.CONFLICT);
  }

  static HTTP_FORBIDDEN(msg = 'Forbidden') {
    return new NormalException(msg, HttpStatus.FORBIDDEN);
  }

  static BAD_REQUEST(msg = 'Bad Request') {
    return new NormalException(msg, HttpStatus.BAD_REQUEST);
  }

  static VALIDATION_ISSUE(msg: string[] | string = 'Validation Issue') {
    return new NormalException(msg, 422);
  }

  static FRAMEWORK_ISSUE(msg = 'Framework Issue') {
    return new NormalException(msg, 10004);
  }

  static HTTP_UNAUTHORIZED(msg = 'Unauthorized') {
    return new NormalException(msg, HttpStatus.UNAUTHORIZED);
  }

  static UNEXPECTED(msg = 'Unexpected Error', code = 10005) {
    return new NormalException(msg, code);
  }

  toJSON(): FailResponse {
    const { message, statusCode, success } = this.getResponse();
    return { message, statusCode, success };
  }

  getResponse(): FailResponse {
    return super.getResponse() as FailResponse;
  }
}
