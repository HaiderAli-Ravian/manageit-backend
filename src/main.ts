import { NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors({ origin: process.env.FRONTEND_URL, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const details = errors.map((err) => ({
          field: err.property,
          messages: Object.values(err.constraints ?? {}),
        }));
        return new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details,
        });
      },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ManageIt API')
    .setDescription('Task management API with JWT cookie auth')
    .setVersion('1.0.0')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
      description: 'JWT access token httpOnly cookie set by /auth/login',
    })
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Auth', 'Authentication and session management')
    .addTag('Tasks', 'Task CRUD and listing')
    .addTag('Admin', 'Admin-only endpoints (requires ADMIN role)')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      withCredentials: true,
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 4000);
}

void bootstrap();
