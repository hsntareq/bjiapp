import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port, '127.0.0.1');
}
void bootstrap();
