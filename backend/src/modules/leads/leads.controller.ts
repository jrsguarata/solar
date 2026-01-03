import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead } from './entities/lead.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CompanyAccessGuard } from '../../common/guards/company-access.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  /**
   * Criar lead (público - formulário da landing page)
   */
  @Post()
  @ApiOperation({ summary: 'Criar lead via formulário público' })
  @ApiResponse({ status: 201, description: 'Lead criado com sucesso', type: Lead })
  async create(@Body() createLeadDto: CreateLeadDto): Promise<Lead> {
    return this.leadsService.create(createLeadDto);
  }

  /**
   * Criar lead manualmente (autenticado)
   */
  @Post('manual')
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar lead manualmente (apenas usuários autenticados)' })
  @ApiResponse({ status: 201, description: 'Lead criado com sucesso' })
  async createManual(
    @Body() createLeadDto: CreateLeadDto,
    @Req() req: any,
  ): Promise<Lead> {
    const accessControl = req.accessControl;
    return this.leadsService.createManual(createLeadDto, accessControl);
  }

  /**
   * Listar todos os leads (com controle de acesso)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os leads (com filtro multi-tenant)' })
  @ApiResponse({ status: 200, description: 'Lista de leads', type: [Lead] })
  async findAll(@Req() req: any): Promise<Lead[]> {
    const accessControl = req.accessControl;
    return this.leadsService.findAll(accessControl);
  }

  /**
   * Buscar lead por ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar lead por ID' })
  @ApiResponse({ status: 200, description: 'Lead encontrado', type: Lead })
  @ApiResponse({ status: 404, description: 'Lead não encontrado' })
  async findOne(@Param('id') id: string, @Req() req: any): Promise<Lead> {
    const accessControl = req.accessControl;
    const lead = await this.leadsService.findOne(id, accessControl);

    if (!lead) {
      throw new NotFoundException(`Lead com ID ${id} não encontrado`);
    }

    return lead;
  }

  /**
   * Atualizar lead
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar lead' })
  @ApiResponse({ status: 200, description: 'Lead atualizado com sucesso' })
  async update(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto,
    @Req() req: any,
  ): Promise<Lead> {
    const userId = req.user.id;
    return this.leadsService.update(id, updateLeadDto, userId);
  }

  /**
   * Avançar lead no funil
   */
  @Patch(':id/advance')
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Avançar lead para próximo status no funil' })
  @ApiResponse({ status: 200, description: 'Lead avançado com sucesso' })
  async advanceStatus(@Param('id') id: string, @Req() req: any): Promise<Lead> {
    const userId = req.user.id;
    return this.leadsService.advanceStatus(id, userId);
  }

  /**
   * Marcar lead como ganho
   */
  @Patch(':id/won')
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar lead como ganho (venda fechada)' })
  async markAsWon(
    @Param('id') id: string,
    @Body('note') note: string,
    @Req() req: any,
  ): Promise<Lead> {
    const userId = req.user.id;
    return this.leadsService.markAsWon(id, userId, note);
  }

  /**
   * Marcar lead como perdido
   */
  @Patch(':id/lost')
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar lead como perdido' })
  async markAsLost(
    @Param('id') id: string,
    @Body('note') note: string,
    @Req() req: any,
  ): Promise<Lead> {
    const userId = req.user.id;
    return this.leadsService.markAsLost(id, userId, note);
  }

  /**
   * Arquivar lead
   */
  @Patch(':id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard, CompanyAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Arquivar lead' })
  async archive(
    @Param('id') id: string,
    @Body('note') note: string,
    @Req() req: any,
  ): Promise<Lead> {
    const userId = req.user.id;
    return this.leadsService.archive(id, userId, note);
  }
}

import { NotFoundException } from '@nestjs/common';
