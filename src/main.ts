import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors(); // Penting jika akses dari frontend Next.js
  app.enableCors({
    origin: 'http://localhost:3000', // Next.js frontend
    credentials: true
  });
  await app.listen(process.env.PORT || 3001); // ← Ubah port ke 5000 atau 3001 karena port 3000 dipake FE wkwk
}
bootstrap();
