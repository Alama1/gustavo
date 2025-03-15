import { Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import {
  AllExceptionFilter,
  BadRequestExceptionFilter,
  ConflictExceptionFilter,
  ForbiddenExceptionFilter,
  NormalExceptionFilter,
  NotFoundExceptionFilter,
  UnauthorizedExceptionFilter,
  ValidationExceptionFilter,
} from '@filters/index';
import { appModules } from '@app/app-modules';

@Module({
  imports: appModules,
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          exceptionFactory: (errors: ValidationError[]) => {
            return errors[0];
          },
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: false,
        }),
    },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_FILTER, useClass: NormalExceptionFilter },
    { provide: APP_FILTER, useClass: ValidationExceptionFilter },
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
    { provide: APP_FILTER, useClass: UnauthorizedExceptionFilter },
    { provide: APP_FILTER, useClass: NotFoundExceptionFilter },
    { provide: APP_FILTER, useClass: ConflictExceptionFilter },
    { provide: APP_FILTER, useClass: BadRequestExceptionFilter },
  ],
})
export class AppModule {}
