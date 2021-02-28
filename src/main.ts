import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupSecurity } from './security';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nestjs crud')
    .setDescription('The Ceccoff API description')
    .setVersion('1.0')
    .addTag('Ceccoff')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  setupSecurity(app);
  
  await app.listen(3000);
}
bootstrap();
