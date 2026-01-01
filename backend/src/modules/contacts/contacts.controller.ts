import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo contato (público)' })
  @ApiResponse({ status: 201, description: 'Contato criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os contatos (apenas ADMIN/COADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de contatos' })
  async findAll(): Promise<Contact[]> {
    return this.contactsService.findAll();
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Listar contatos de uma empresa (público)' })
  @ApiResponse({ status: 200, description: 'Lista de contatos da empresa' })
  async findByCompany(@Param('companyId') companyId: string): Promise<Contact[]> {
    return this.contactsService.findByCompany(companyId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.COADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar contato por ID (apenas ADMIN/COADMIN)' })
  @ApiResponse({ status: 200, description: 'Contato encontrado' })
  @ApiResponse({ status: 404, description: 'Contato não encontrado' })
  async findOne(@Param('id') id: string): Promise<Contact | null> {
    return this.contactsService.findOne(id);
  }
}
