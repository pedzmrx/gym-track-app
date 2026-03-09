process.env.DATABASE_URL = "postgresql://admin:password123@localhost:5432/gym_db?schema=public";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
