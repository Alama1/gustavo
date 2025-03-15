import { AppConfig } from '@app/app.config';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiModule } from 'modules/ai/ai.module';
import { LoggerModule } from 'nestjs-pino';

export const appModules: (
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<any>
)[] = [
  ConfigModule.forRoot(AppConfig.getInitConfig()),
  LoggerModule.forRoot(AppConfig.getLoggerConfig()),
  AiModule,
];
