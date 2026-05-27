import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // 👈 Required for webhook signature verification
  });

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Server running on http://localhost:3000');
}
bootstrap();