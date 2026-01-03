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
  HttpStatus,
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
import { Response } from 'express';
import { ContactsProposalsService } from './contacts-proposals.service';
import { CreateContactProposalDto } from './dto/create-contact-proposal.dto';
import { ContactProposal } from './entities/contact-proposal.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import * as fs from 'fs';

@ApiTags('contact-proposals')
@Controller('contacts/:contactId/proposals')
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
    summary: 'Enviar proposta comercial para contato (apenas ADMIN/COADMIN)',
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
    type: ContactProposal,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou arquivo muito grande' })
  @ApiResponse({ status: 404, description: 'Contato não encontrado' })
  async create(
    @Param('contactId') contactId: string,
    @Body() createDto: CreateContactProposalDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: any,
  ): Promise<ContactProposal> {
    return this.proposalsService.create(contactId, createDto, file, currentUser.id);
  }

  // ═══════════════════════════════════════════════════════════
  // LISTAR TODAS AS PROPOSTAS DE UM CONTATO
  // ═══════════════════════════════════════════════════════════

  @Get()
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiOperation({
    summary: 'Listar todas as propostas de um contato',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de propostas retornada com sucesso',
    type: [ContactProposal],
  })
  async findByContact(@Param('contactId') contactId: string): Promise<ContactProposal[]> {
    return this.proposalsService.findByContact(contactId);
  }

  // ═══════════════════════════════════════════════════════════
  // BUSCAR ÚLTIMA PROPOSTA DE UM CONTATO
  // ═══════════════════════════════════════════════════════════

  @Get('latest')
  @Roles(UserRole.ADMIN, UserRole.COADMIN, UserRole.OPERATOR)
  @ApiOperation({
    summary: 'Buscar última proposta enviada para um contato',
  })
  @ApiResponse({
    status: 200,
    description: 'Última proposta retornada com sucesso',
    type: ContactProposal,
  })
  @ApiResponse({ status: 404, description: 'Nenhuma proposta encontrada' })
  async findLatest(@Param('contactId') contactId: string): Promise<ContactProposal | null> {
    return this.proposalsService.findLatest(contactId);
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
    type: ContactProposal,
  })
  @ApiResponse({ status: 404, description: 'Proposta não encontrada' })
  async findOne(@Param('id') id: string): Promise<ContactProposal> {
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
