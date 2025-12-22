import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { DistributorsService } from './distributors.service';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { UpdateDistributorDto } from './dto/update-distributor.dto';
import { Distributor } from './entities/distributor.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('distributors')
@Controller('distributors')
export class DistributorsController {
  constructor(private readonly distributorsService: DistributorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova distribuidora (apenas ADMIN)' })
  @ApiResponse({ status: 201, description: 'Distribuidora criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async create(@Body() createDistributorDto: CreateDistributorDto): Promise<Distributor> {
    return this.distributorsService.create(createDistributorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as distribuidoras (público)' })
  @ApiResponse({ status: 200, description: 'Lista de distribuidoras', type: [Distributor] })
  async findAll(): Promise<Distributor[]> {
    return this.distributorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar distribuidora por ID (público)' })
  @ApiResponse({ status: 200, description: 'Distribuidora encontrada', type: Distributor })
  @ApiResponse({ status: 404, description: 'Distribuidora não encontrada' })
  async findOne(@Param('id') id: string): Promise<Distributor> {
    return this.distributorsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar distribuidora (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Distribuidora atualizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Distribuidora não encontrada' })
  async update(
    @Param('id') id: string,
    @Body() updateDistributorDto: UpdateDistributorDto,
  ): Promise<Distributor> {
    return this.distributorsService.update(id, updateDistributorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover distribuidora (apenas ADMIN)' })
  @ApiResponse({ status: 200, description: 'Distribuidora removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Distribuidora não encontrada' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.distributorsService.remove(id);
  }
}
