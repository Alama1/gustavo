import { AppConfig, AppModule } from '@app/index';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { setupGlobalErrorHandlers } from '@utils/app/runtime-handler';

setupGlobalErrorHandlers();

import { Logger, PinoLogger } from 'nestjs-pino';

const { PORT, BACKEND_URL } = process.env;
const bootstrap = async () => {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    logger: new Logger(new PinoLogger(AppConfig.getLoggerConfig()), {}),
  });

  const config = new DocumentBuilder()
    .setTitle('Gustavo API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.enableCors({
    origin: [BACKEND_URL, /^https?:\/\/localhost:[0-9]+$/],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(PORT);
};

bootstrap();
