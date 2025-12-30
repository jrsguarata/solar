import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributorsService } from './distributors.service';
import { DistributorsController } from './distributors.controller';
import { Distributor } from './entities/distributor.entity';

/**
 * Distributors Module
 *
 * Módulo simplificado apenas para referência de distribuidoras.
 * Fornece apenas consulta (GET) - sem operações de CRUD.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Distributor])],
  controllers: [DistributorsController],
  providers: [DistributorsService],
  exports: [DistributorsService], // Exporta para uso em outros módulos (ex: Concessionaires)
})
export class DistributorsModule {}
