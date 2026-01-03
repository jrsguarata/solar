import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { ContactsProposalsService } from './contacts-proposals.service';
import { CreateContactProposalDto } from './dto/create-contact-proposal.dto';
import { LeadProposal } from './entities/lead-proposal.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import * as fs from 'fs';

@ApiTags('lead-proposals')
@Controller('leads/:leadId/proposals')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContactsProposalsController {
  constructor(
    private readonly proposalsService: ContactsProposalsService,
  ) {}

  // ═══════════════════════════════════════════════════════════
  // CRIAR PROPOSTA (UPLOAD DE ARQUIVO)
  // ═══════════════════════════════════════════════════════════

  @Post()
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Enviar proposta comercial para lead (apenas ADMIN/COADMIN)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quotaKwh: {
          type: 'number',
          example: 400,
          description: 'Cota proposta em kWh/mês',
        },
        monthlyValue: {
          type: 'number',
          example: 280.0,
          description: 'Valor mensal da cota (R$)',
        },
        monthlySavings: {
          type: 'number',
          example: 70.0,
          description: 'Economia mensal estimada (R$)',
        },
        notes: {
          type: 'string',
          example: 'Proposta revisada com desconto de 5%',
          description: 'Observações sobre esta versão',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo da proposta (PDF, DOCX ou DOC - máx 10MB)',
        },
      },
      required: ['quotaKwh', 'monthlyValue', 'file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Proposta criada com sucesso',
    type: LeadProposal,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou arquivo muito grande' })
  @ApiResponse({ status: 404, description: 'Lead não encontrado' })
  async create(
    @Param('leadId') leadId: string,
    @Body() createDto: CreateContactProposalDto,
    @UploadedFile() file: any,
    @CurrentUser() currentUser: any,
  ): Promise<LeadProposal> {
    return this.proposalsService.create(leadId, createDto, file, currentUser.id);
  }

  // ═══════════════════════════════════════════════════════════
  // LISTAR TODAS AS PROPOSTAS DE UM LEAD
  // ═══════════════════════════════════════════════════════════

  @Get()
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiOperation({
    summary: 'Listar todas as propostas de um lead',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de propostas retornada com sucesso',
    type: [LeadProposal],
  })
  async findByLead(@Param('leadId') leadId: string): Promise<LeadProposal[]> {
    return this.proposalsService.findByLead(leadId);
  }

  // ═══════════════════════════════════════════════════════════
  // BUSCAR ÚLTIMA PROPOSTA DE UM LEAD
  // ═══════════════════════════════════════════════════════════

  @Get('latest')
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiOperation({
    summary: 'Buscar última proposta enviada para um lead',
  })
  @ApiResponse({
    status: 200,
    description: 'Última proposta retornada com sucesso',
    type: LeadProposal,
  })
  @ApiResponse({ status: 404, description: 'Nenhuma proposta encontrada' })
  async findLatest(@Param('leadId') leadId: string): Promise<LeadProposal | null> {
    return this.proposalsService.findLatest(leadId);
  }

  // ═══════════════════════════════════════════════════════════
  // BUSCAR UMA PROPOSTA ESPECÍFICA
  // ═══════════════════════════════════════════════════════════

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiOperation({
    summary: 'Buscar detalhes de uma proposta específica',
  })
  @ApiResponse({
    status: 200,
    description: 'Proposta encontrada com sucesso',
    type: LeadProposal,
  })
  @ApiResponse({ status: 404, description: 'Proposta não encontrada' })
  async findOne(@Param('id') id: string): Promise<LeadProposal> {
    return this.proposalsService.findOne(id);
  }

  // ═══════════════════════════════════════════════════════════
  // DOWNLOAD DE ARQUIVO DA PROPOSTA
  // ═══════════════════════════════════════════════════════════

  @Get(':id/download')
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiOperation({
    summary: 'Baixar arquivo da proposta',
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo baixado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Proposta ou arquivo não encontrado' })
  async download(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const { filePath, fileName, mimeType } = await this.proposalsService.getFile(id);

    // Configurar headers para download
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Stream do arquivo
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  // ═══════════════════════════════════════════════════════════
  // EXCLUIR PROPOSTA (APENAS ADMIN)
  // ═══════════════════════════════════════════════════════════

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Excluir proposta (apenas ADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Proposta excluída com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Proposta não encontrada' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.proposalsService.remove(id);
    return { message: 'Proposta excluída com sucesso' };
  }
}
