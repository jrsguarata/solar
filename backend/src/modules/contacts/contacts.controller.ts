import { Controller, Get, Post, Body, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from './entities/lead.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CompanyAccessGuard } from '../../common/guards/company-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('leads')
@Controller('leads')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo lead (público - landing page)' })
  @ApiResponse({ status: 201, description: 'Lead criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createLeadDto: CreateLeadDto): Promise<Lead> {
    return this.contactsService.create(createLeadDto);
  }

  @Post('manual')
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar lead manualmente (apenas usuários autenticados)' })
  @ApiResponse({ status: 201, description: 'Lead manual criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createManual(
    @Body() createLeadDto: CreateLeadDto,
    @Req() req: any,
  ): Promise<Lead> {
    const accessControl = req.accessControl;
    return this.contactsService.createManual(createLeadDto, accessControl);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar leads (com filtro multi-tenant)' })
  @ApiResponse({ status: 200, description: 'Lista de leads filtrada por acesso' })
  async findAll(@Req() req: any): Promise<Lead[]> {
    const accessControl = req.accessControl;
    return this.contactsService.findAll(accessControl);
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Listar leads de uma empresa (público)' })
  @ApiResponse({ status: 200, description: 'Lista de leads da empresa' })
  async findByCompany(@Param('companyId') companyId: string): Promise<Lead[]> {
    return this.contactsService.findByCompany(companyId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar lead por ID (com validação de acesso)' })
  @ApiResponse({ status: 200, description: 'Lead encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Lead não encontrado' })
  async findOne(@Param('id') id: string, @Req() req: any): Promise<Lead | null> {
    const accessControl = req.accessControl;
    return this.contactsService.findOne(id, accessControl);
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
