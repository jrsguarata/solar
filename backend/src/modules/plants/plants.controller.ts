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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlantsService } from './plants.service';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Plant } from './entities/plant.entity';

@Controller('plants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('plants')
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiOperation({ summary: 'Criar nova usina (Admin/CoAdmin)' })
  @ApiResponse({ status: 201, description: 'Usina criada com sucesso', type: Plant })
  create(@Body() createPlantDto: CreatePlantDto) {
    return this.plantsService.create(createPlantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as usinas' })
  @ApiResponse({ status: 200, description: 'Lista de usinas', type: [Plant] })
  findAll(@CurrentUser() currentUser: any) {
    return this.plantsService.findAll(currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usina por ID' })
  @ApiResponse({ status: 200, description: 'Usina encontrada', type: Plant })
  @ApiResponse({ status: 404, description: 'Usina não encontrada' })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.plantsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiOperation({ summary: 'Atualizar usina (Admin/CoAdmin)' })
  @ApiResponse({ status: 200, description: 'Usina atualizada com sucesso', type: Plant })
  @ApiResponse({ status: 404, description: 'Usina não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updatePlantDto: UpdatePlantDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.plantsService.update(id, updatePlantDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiOperation({ summary: 'Excluir usina (Admin/CoAdmin)' })
  @ApiResponse({ status: 200, description: 'Usina excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Usina não encontrada' })
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.plantsService.remove(id, currentUser);
  }
}
