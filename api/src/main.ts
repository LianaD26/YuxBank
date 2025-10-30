import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

console.log('Iniciando main.ts...');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Validación global con class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('YuxBank API')
    .setDescription('API para YuxBank')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Diagnóstico de conexión a DB
  try {
    const dataSource = app.get(DataSource);
    const config = app.get(ConfigService);
    const rawUrl = config.get<string>('DATABASE_URL');
    const masked = rawUrl ? rawUrl.replace(/:(.*?)@/, ':****@') : 'undefined';
    console.log('[ENV] cwd=', process.cwd());
    console.log('[ENV] DATABASE_URL=', masked);
    const rows = await dataSource.query(
      'select current_database() as db, current_user as usr, current_schema() as schema, inet_server_addr() as addr, inet_server_port() as port'
    );
    console.log('[DB]', rows[0]);
  } catch (e) {
    console.warn('[DB] No se pudo obtener info de conexión:', (e as any)?.message);
  }

  console.log('App creada, antes de listen');
  await app.listen(3000);
  console.log('Server corriendo en puerto 3000');
}

bootstrap();
