import { ConfigModuleOptions } from '@nestjs/config';
import { LogLevel, NodeEnv } from '@shared/enums';
import { IncomingMessage, ServerResponse } from 'http';
import * as Joi from 'joi';
import { Params } from 'nestjs-pino';

export class AppConfig {
  public static getInitConfig(): ConfigModuleOptions {
    const validNodeEnvList = Object.keys(NodeEnv).map((key) => NodeEnv[key]);
    const validLogLevelList = Object.keys(LogLevel).map((key) => LogLevel[key]);
    return {
      isGlobal: true,
      validationSchema: Joi.object(<
        { [P in keyof NodeJS.ProcessEnv]: Joi.SchemaInternals }
      >{
        PORT: Joi.number().min(1000).max(65535).required(),
        NODE_ENV: Joi.string()
          .valid(...validNodeEnvList)
          .required(),
        LOG_LEVEL: Joi.string()
          .allow('')
          .valid(...validLogLevelList)
          .optional(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        BACKEND_URL: Joi.string().uri().required(),
      }),
    };
  }

  public static getLoggerConfig(): Params {
    const { NODE_ENV, LOG_LEVEL } = process.env;

    return {
      pinoHttp: {
        transport:
          NODE_ENV !== NodeEnv.PRODUCTION
            ? {
                target: 'pino-pretty',
                options: {
                  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
                },
              }
            : null,
        autoLogging: {
          ignore: (req: IncomingMessage) => {
            const { url } = req;
            return url.includes('/healthz');
          },
        },
        level:
          LOG_LEVEL ||
          (NODE_ENV === NodeEnv.PRODUCTION ? LogLevel.INFO : LogLevel.TRACE),
        serializers: {
          req(request: IncomingMessage) {
            return {
              method: request.method,
              url: request.url,
            };
          },
          res(reply: ServerResponse) {
            return {
              statusCode: reply.statusCode,
            };
          },
        },
        customAttributeKeys: {
          responseTime: 'timeSpent',
        },
        base: {},
      },
    };
  }
}
