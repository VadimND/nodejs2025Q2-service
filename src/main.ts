import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { readFile } from 'fs/promises';
import { parse } from 'yaml';

const PORT = process.env.PORT || 4000;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const filePath = join(__dirname, '..', 'doc', 'api.yaml');
  const file = await readFile(filePath, 'utf-8');
  const swaggerDocument = parse(file);
  SwaggerModule.setup('doc', app, swaggerDocument);

  await app.listen(PORT);
}
bootstrap();
