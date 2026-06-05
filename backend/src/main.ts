import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './modules/config/config.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { ResponseInterceptor } from './common/interceptors';
import { HttpExceptionFilter, ZodExceptionFilter } from './common/filters';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();

  const CLIENT_URL = configService.get('CLIENT_URL');
  const PORT = configService.get('APP_PORT');

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(), new ZodExceptionFilter());

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: [CLIENT_URL],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT ?? 3000);
}
bootstrap();
