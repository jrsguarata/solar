import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { DistributorsModule } from './modules/distributors/distributors.module';
import { MailModule } from './modules/mail/mail.module';
import { ConcessionairesModule } from './modules/concessionaires/concessionaires.module';
import { PlantsModule } from './modules/plants/plants.module';
import { CooperativesModule } from './modules/cooperatives/cooperatives.module';
import { PartnersModule } from './modules/partners/partners.module';
import { HealthModule } from './modules/health/health.module';
import { validate } from './config/env.validation';
import { CacheConfigService } from './config/cache.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfigService,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 segundos
        limit: 10, // 10 requisições por minuto (global)
      },
    ]),
    DatabaseModule,
    CommonModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ContactsModule,
    DistributorsModule,
    MailModule,
    ConcessionairesModule,
    PlantsModule,
    CooperativesModule,
    PartnersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
