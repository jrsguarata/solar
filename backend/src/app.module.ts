import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    DatabaseModule,
    CommonModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ContactsModule,
    DistributorsModule,
    MailModule,
    ConcessionairesModule,
    PlantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
