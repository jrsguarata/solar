import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeadProposal } from './entities/lead-proposal.entity';
import { Lead } from './entities/lead.entity';
import { CreateContactProposalDto } from './dto/create-contact-proposal.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ContactsProposalsService {
  private readonly logger = new Logger(ContactsProposalsService.name);
  private readonly DOCUMENTS_PATH = 'documents/proposals';
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_MIMETYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
  ];

  constructor(
    @InjectRepository(LeadProposal)
    private readonly proposalRepository: Repository<LeadProposal>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  // ═══════════════════════════════════════════════════════════
  // CRIAR PROPOSTA COM UPLOAD DE ARQUIVO
  // ═══════════════════════════════════════════════════════════

  async create(
    contactId: string,
    createDto: CreateContactProposalDto,
    file: Express.Multer.File,
    userId: string,
  ): Promise<LeadProposal> {
    // Validar se contato existe
    const lead = await this.leadRepository.findOne({
      where: { id: contactId },
    });

    if (!contact) {
      throw new NotFoundException(`Contato com ID ${contactId} não encontrado`);
    }

    // Validar status do contato (só pode enviar proposta para PROSPECT)
    if (lead.status !== 'SUSPECT' && lead.status !== 'PROSPECT') {
      throw new BadRequestException(
        'Propostas só podem ser enviadas para contatos com status SUSPECT ou PROSPECT',
      );
    }

    // Validar arquivo
    this.validateFile(file);

    // Calcular próxima versão
    const lastProposal = await this.proposalRepository.findOne({
      where: { contactId },
      order: { version: 'DESC' },
    });

    const nextVersion = lastProposal ? lastProposal.version + 1 : 1;

    // Salvar arquivo no sistema de arquivos
    const filePath = await this.saveFile(contactId, nextVersion, file);

    // Criar registro no banco
    const proposal = this.proposalRepository.create({
      contactId,
      version: nextVersion,
      quotaKwh: createDto.quotaKwh,
      monthlyValue: createDto.monthlyValue,
      monthlySavings: createDto.monthlySavings,
      filePath,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      notes: createDto.notes,
      sentBy: userId,
    });

    const savedProposal = await this.proposalRepository.save(proposal);

    this.logger.log(
      `Proposta v${nextVersion} criada para contato ${contactId} por usuário ${userId}`,
    );

    // Retornar com relacionamentos
    return this.findOne(savedProposal.id);
  }

  // ═══════════════════════════════════════════════════════════
  // VALIDAR ARQUIVO
  // ═══════════════════════════════════════════════════════════

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }

    // Validar tamanho
    if (file.size > this.MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Arquivo muito grande. Tamanho máximo: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
      );
    }

    // Validar tipo
    if (!this.ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de arquivo não permitido. Aceitos: PDF, DOCX, DOC',
      );
    }
  }

  // ═══════════════════════════════════════════════════════════
  // SALVAR ARQUIVO NO SISTEMA DE ARQUIVOS
  // ═══════════════════════════════════════════════════════════

  private async saveFile(
    contactId: string,
    version: number,
    file: Express.Multer.File,
  ): Promise<string> {
    // Criar diretório do contato se não existir
    const contactDir = path.join(this.DOCUMENTS_PATH, contactId);
    await fs.mkdir(contactDir, { recursive: true });

    // Gerar nome do arquivo: v{version}-{original-name}
    const extension = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, extension);
    const fileName = `v${version}-${nameWithoutExt}${extension}`;
    const filePath = path.join(contactDir, fileName);

    // Salvar arquivo
    await fs.writeFile(filePath, file.buffer);

    this.logger.log(`Arquivo salvo em: ${filePath}`);

    return filePath;
  }

  // ═══════════════════════════════════════════════════════════
  // BUSCAR TODAS AS PROPOSTAS DE UM CONTATO
  // ═══════════════════════════════════════════════════════════

  async findByContact(contactId: string): Promise<ContactProposal[]> {
    return this.proposalRepository.find({
      where: { contactId },
      relations: ['sentByUser'],
      order: { version: 'DESC' },
    });
  }

  // ═══════════════════════════════════════════════════════════
  // BUSCAR UMA PROPOSTA ESPECÍFICA
  // ═══════════════════════════════════════════════════════════

  async findOne(id: string): Promise<LeadProposal> {
    const proposal = await this.proposalRepository.findOne({
      where: { id },
      relations: ['sentByUser', 'contact'],
    });

    if (!proposal) {
      throw new NotFoundException(`Proposta com ID ${id} não encontrada`);
    }

    return proposal;
  }

  // ═══════════════════════════════════════════════════════════
  // BUSCAR ÚLTIMA PROPOSTA DE UM CONTATO
  // ═══════════════════════════════════════════════════════════

  async findLatest(contactId: string): Promise<ContactProposal | null> {
    return this.proposalRepository.findOne({
      where: { contactId },
      relations: ['sentByUser'],
      order: { version: 'DESC' },
    });
  }

  // ═══════════════════════════════════════════════════════════
  // BAIXAR ARQUIVO DA PROPOSTA
  // ═══════════════════════════════════════════════════════════

  async getFile(id: string): Promise<{ filePath: string; fileName: string; mimeType: string }> {
    const proposal = await this.findOne(id);

    // Verificar se arquivo existe
    try {
      await fs.access(proposal.filePath);
    } catch (error) {
      this.logger.error(`Arquivo não encontrado: ${proposal.filePath}`);
      throw new NotFoundException('Arquivo da proposta não encontrado no sistema');
    }

    return {
      filePath: proposal.filePath,
      fileName: proposal.fileName,
      mimeType: proposal.mimeType,
    };
  }

  // ═══════════════════════════════════════════════════════════
  // EXCLUIR PROPOSTA (SOFT DELETE - APENAS ADMIN)
  // ═══════════════════════════════════════════════════════════

  async remove(id: string): Promise<void> {
    const proposal = await this.findOne(id);

    // Excluir arquivo do sistema de arquivos
    try {
      await fs.unlink(proposal.filePath);
      this.logger.log(`Arquivo excluído: ${proposal.filePath}`);
    } catch (error) {
      this.logger.warn(`Erro ao excluir arquivo: ${proposal.filePath}`, error);
    }

    // Excluir registro do banco
    await this.proposalRepository.remove(proposal);
  }
}
