import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadStatus } from '../entities/lead.entity';

export class UpdateLeadDto {
  @ApiProperty({
    example: 'SUSPECT',
    enum: LeadStatus,
    description: 'Status do lead',
    required: false,
  })
  @IsOptional()
  @IsEnum(LeadStatus, {
    message: 'Status deve ser LEAD, SUSPECT, PROSPECT, CLIENTE, SEM_COBERTURA ou DESCARTADO',
  })
  status?: LeadStatus;

  @ApiProperty({
    example: 'Cliente demonstrou interesse em energia solar para empresa de médio porte',
    description: 'Anotações sobre o contato',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nota deve ser uma string' })
  note?: string;
}
