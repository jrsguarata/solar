import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../modules/users/entities/user.entity';
import { AuditService } from '../services/audit.service';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiTags('audit-logs')
@ApiBearerAuth()
export class AuditLogsController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audit logs (Admin only)' })
  @ApiQuery({ name: 'tableName', required: false, description: 'Filtrar por nome da tabela' })
  @ApiQuery({ name: 'action', required: false, description: 'Filtrar por ação (INSERT, UPDATE, DELETE)' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar por ID do usuário' })
  @ApiQuery({ name: 'recordId', required: false, description: 'Filtrar por ID do registro' })
  async findAll(
    @Query('tableName') tableName?: string,
    @Query('action') action?: string,
    @Query('userId') userId?: string,
    @Query('recordId') recordId?: string,
  ) {
    return this.auditService.findAll({
      tableName,
      action,
      userId,
      recordId,
    });
  }

  @Get('history')
  @ApiOperation({ summary: 'Get audit history for a specific record' })
  @ApiQuery({ name: 'tableName', required: true, description: 'Nome da tabela' })
  @ApiQuery({ name: 'recordId', required: true, description: 'ID do registro' })
  async getHistory(
    @Query('tableName') tableName: string,
    @Query('recordId') recordId: string,
  ) {
    return this.auditService.getAuditHistory(tableName, recordId);
  }
}
