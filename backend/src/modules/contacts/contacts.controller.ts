import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from './entities/lead.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('leads')
@Controller('leads')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo lead (público)' })
  @ApiResponse({ status: 201, description: 'Lead criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createLeadDto: CreateLeadDto): Promise<Lead> {
    return this.contactsService.create(createLeadDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os leads (apenas ADMIN/COADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de leads' })
  async findAll(): Promise<Lead[]> {
    return this.contactsService.findAll();
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Listar leads de uma empresa (público)' })
  @ApiResponse({ status: 200, description: 'Lista de leads da empresa' })
  async findByCompany(@Param('companyId') companyId: string): Promise<Lead[]> {
    return this.contactsService.findByCompany(companyId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar lead por ID (apenas ADMIN/COADMIN)' })
  @ApiResponse({ status: 200, description: 'Lead encontrado' })
  @ApiResponse({ status: 404, description: 'Lead não encontrado' })
  async findOne(@Param('id') id: string): Promise<Lead | null> {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar status e adicionar nota ao lead (apenas ADMIN/COADMIN)' })
  @ApiResponse({ status: 200, description: 'Lead atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Lead não encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @CurrentUser() currentUser: any,
  ): Promise<Lead> {
    return this.contactsService.update(id, updateLeadDto, currentUser.id);
  }
}
