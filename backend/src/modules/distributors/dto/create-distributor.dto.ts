import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateDistributorDto {
  @ApiProperty({
    description: 'Código da distribuidora',
    example: 'CPFL',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Código deve ser uma string' })
  @MaxLength(50, { message: 'Código deve ter no máximo 50 caracteres' })
  code?: string;

  @ApiProperty({
    description: 'Unidade Federativa (Estado)',
    example: 'SP',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'UF deve ser uma string' })
  @MaxLength(50, { message: 'UF deve ter no máximo 50 caracteres' })
  uf?: string;

  @ApiProperty({
    description: 'Nome da distribuidora',
    example: 'CPFL Paulista',
  })
  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string' })
  @MaxLength(128, { message: 'Nome deve ter no máximo 128 caracteres' })
  name?: string;

  @ApiProperty({
    description: 'Tipo da distribuidora',
    example: 'Energia Elétrica',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Tipo deve ser uma string' })
  @MaxLength(50, { message: 'Tipo deve ter no máximo 50 caracteres' })
  type?: string;
}
