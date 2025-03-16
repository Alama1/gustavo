import { AppConfig } from '@app/app.config';
import { dataSourceOptions } from '@app/data-source';
import { DiscordModule } from '@discord/discord.module';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from 'modules/ai/ai.module';
import { LoggerModule } from 'nestjs-pino';

export const appModules: (
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<any>
)[] = [
  ConfigModule.forRoot(AppConfig.getInitConfig()),
  TypeOrmModule.forRoot(dataSourceOptions),
  LoggerModule.forRoot(AppConfig.getLoggerConfig()),
  AiModule,
  DiscordModule,
];
