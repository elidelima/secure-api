import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<EnvironmentVariables> = app.get(ConfigService);
  await app.listen(configService.get('apiPort'));
}
bootstrap();
