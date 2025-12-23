import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix(configService.get('API_PREFIX') || 'api/v1');

  app.useGlobalInterceptors(new AuditInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(error => {
          const constraints = error.constraints;
          if (constraints) {
            // Traduzir mensagens padrão para português
            const translatedMessages = Object.values(constraints).map(msg => {
              return msg
                .replace(/property .+ should not exist/i, `propriedade ${error.property} não deveria existir`)
                .replace(/(.+) should not be empty/i, '$1 não pode estar vazio')
                .replace(/(.+) must be a string/i, '$1 deve ser uma string')
                .replace(/(.+) must be an email/i, '$1 deve ser um email válido');
            });
            return translatedMessages.join(', ');
          }
          return `Erro de validação em ${error.property}`;
        });

        return new BadRequestException(messages.join('; '));
      },
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Solar API - Gestão de Geração Distribuída')
    .setDescription('API para Sistema de Gestão de Geração Distribuída - Gerenciamento de usinas de energia solar e outras fontes de geração distribuída')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação e autorização')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('companies', 'Gerenciamento de empresas')
    .addTag('distributors', 'Gerenciamento de distribuidoras de energia')
    .addTag('contacts', 'Formulário de contato da landing page')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
