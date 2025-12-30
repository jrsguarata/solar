import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DistributorsService } from './distributors.service';
import { Distributor } from './entities/distributor.entity';

@ApiTags('distributors')
@Controller('distributors')
export class DistributorsController {
  constructor(private readonly distributorsService: DistributorsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as distribuidoras (público)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de distribuidoras',
    type: [Distributor],
  })
  async findAll(): Promise<Distributor[]> {
    return this.distributorsService.findAll();
  }
}
