import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsUUID } from 'class-validator';
import { LeadStatus } from '../entities/lead.entity';

export class UpdateLeadDto {
  @ApiPropertyOptional({ example: 'QUALIFIED' })
  @IsOptional()
  @IsEnum(LeadStatus, { message: 'Status inválido' })
  status?: LeadStatus;

  @ApiPropertyOptional({ example: 'uuid-do-usuario' })
  @IsOptional()
  @IsUUID()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'Cliente demonstrou interesse em proposta comercial' })
  @IsOptional()
  @IsString({ message: 'Nota deve ser uma string' })
  note?: string;

  @ApiPropertyOptional({ example: 'Atualização das observações gerais' })
  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;
}
