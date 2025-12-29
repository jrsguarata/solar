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
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ConcessionairesService } from './concessionaires.service';
import { CreateConcessionaireDto } from './dto/create-concessionaire.dto';
import { UpdateConcessionaireDto } from './dto/update-concessionaire.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('concessionaires')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.COADMIN)
@ApiTags('concessionaires')
@ApiBearerAuth()
export class ConcessionairesController {
  constructor(
    private readonly concessionairesService: ConcessionairesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova concessionária (ADMIN ou COADMIN)' })
  @ApiResponse({ status: 201, description: 'Concessionária criada' })
  create(
    @Body() createConcessionaireDto: CreateConcessionaireDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.concessionairesService.create(
      createConcessionaireDto,
      currentUser,
    );
  }

  @Get()
  @ApiOperation({
    summary:
      'Listar concessionárias (ADMIN vê todas, COADMIN vê apenas da sua empresa)',
  })
  findAll(@CurrentUser() currentUser: any) {
    return this.concessionairesService.findAll(currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar concessionária por ID' })
  findOne(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.concessionairesService.findOne(id, currentUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar concessionária' })
  update(
    @Param('id') id: string,
    @Body() updateConcessionaireDto: UpdateConcessionaireDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.concessionairesService.update(
      id,
      updateConcessionaireDto,
      currentUser,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover concessionária (soft delete)' })
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    return this.concessionairesService.remove(id, currentUser);
  }
}
