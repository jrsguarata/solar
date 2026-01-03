import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateContactProposalDto {
  @ApiProperty({
    example: 400,
    description: 'Cota proposta em kWh/mês',
  })
  @IsNumber()
  @Min(0)
  quotaKwh: number;

  @ApiProperty({
    example: 280.0,
    description: 'Valor mensal da cota (R$)',
  })
  @IsNumber()
  @Min(0)
  monthlyValue: number;

  @ApiProperty({
    example: 70.0,
    description: 'Economia mensal estimada (R$)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlySavings?: number;

  @ApiProperty({
    example: 'Cliente solicitou revisão de valores. Nova proposta com desconto de 5%.',
    description: 'Observações sobre esta versão da proposta',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
