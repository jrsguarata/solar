import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CompaniesModule } from '../companies/companies.module';
import { PartnersModule } from '../partners/partners.module';
import { CompanyAccessGuard } from '../auth/guards/company-access.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CompaniesModule,
    PartnersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, CompanyAccessGuard],
  exports: [UsersService],
})
export class UsersModule {}
