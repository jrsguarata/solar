import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcessionairesService } from './concessionaires.service';
import { ConcessionairesController } from './concessionaires.controller';
import { Concessionaire } from './entities/concessionaire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concessionaire])],
  controllers: [ConcessionairesController],
  providers: [ConcessionairesService],
  exports: [ConcessionairesService],
})
export class ConcessionairesModule {}
