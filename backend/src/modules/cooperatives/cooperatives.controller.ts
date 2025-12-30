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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CooperativesService } from './cooperatives.service';
import { CreateCooperativeDto } from './dto/create-cooperative.dto';
import { UpdateCooperativeDto } from './dto/update-cooperative.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cooperatives')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('cooperatives')
export class CooperativesController {
  constructor(private readonly cooperativesService: CooperativesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiOperation({ summary: 'Criar nova cooperativa (Admin/CoAdmin)' })
  @ApiResponse({
    status: 201,
    description: 'Cooperativa criada com sucesso',
  })
  create(@Body() createCooperativeDto: CreateCooperativeDto) {
    return this.cooperativesService.create(createCooperativeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as cooperativas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cooperativas retornada com sucesso',
  })
  findAll(@CurrentUser() currentUser: any) {
    return this.cooperativesService.findAll(currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cooperativa por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cooperativa encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperativa não encontrada',
  })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.cooperativesService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiOperation({ summary: 'Atualizar cooperativa (Admin/CoAdmin)' })
  @ApiResponse({
    status: 200,
    description: 'Cooperativa atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperativa não encontrada',
  })
  update(
    @Param('id') id: string,
    @Body() updateCooperativeDto: UpdateCooperativeDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.cooperativesService.update(id, updateCooperativeDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiOperation({ summary: 'Deletar cooperativa (Admin/CoAdmin)' })
  @ApiResponse({
    status: 200,
    description: 'Cooperativa deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Cooperativa não encontrada',
  })
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.cooperativesService.remove(id, currentUser);
  }
}
