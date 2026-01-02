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
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('partners')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiOperation({ summary: 'Criar novo parceiro (Admin/CoAdmin)' })
  @ApiResponse({
    status: 201,
    description: 'Parceiro criado com sucesso',
  })
  @ApiResponse({
    status: 409,
    description: 'Código ou CNPJ já existe',
  })
  create(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.create(createPartnerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os parceiros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de parceiros retornada com sucesso',
  })
  findAll() {
    return this.partnersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar parceiro por ID' })
  @ApiResponse({
    status: 200,
    description: 'Parceiro encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Parceiro não encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.partnersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiOperation({ summary: 'Atualizar parceiro (Admin/CoAdmin)' })
  @ApiResponse({
    status: 200,
    description: 'Parceiro atualizado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Parceiro não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Código ou CNPJ já existe',
  })
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiOperation({ summary: 'Deletar parceiro (Admin/CoAdmin)' })
  @ApiResponse({
    status: 200,
    description: 'Parceiro deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Parceiro não encontrado',
  })
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}
