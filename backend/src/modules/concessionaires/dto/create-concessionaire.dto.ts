import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  Length,
  Matches,
} from 'class-validator';

export class CreateConcessionaireDto {
  @ApiProperty({
    example: 'uuid-distributor',
    description: 'ID da distribuidora',
  })
  @IsUUID('4', { message: 'ID da distribuidora deve ser um UUID válido' })
  @IsNotEmpty({ message: 'Distribuidora não pode estar vazia' })
  distributorId: string;

  @ApiProperty({
    example: 'AB34567890123Z',
    description: 'CNPJ da concessionária no novo formato alfanumérico (12 caracteres alfanuméricos + 2 dígitos verificadores)',
  })
  @IsString({ message: 'CNPJ deve ser uma string' })
  @IsNotEmpty({ message: 'CNPJ não pode estar vazio' })
  @Length(14, 14, { message: 'CNPJ deve ter 14 caracteres' })
  @Matches(/^[A-Za-z0-9]{12}\d{2}$/, {
    message: 'CNPJ deve conter 12 caracteres alfanuméricos (letras e números) seguidos de 2 dígitos verificadores',
  })
  cnpj: string;

  @ApiProperty({ example: '12345-678', description: 'CEP (com ou sem hífen)' })
  @IsString({ message: 'CEP deve ser uma string' })
  @IsNotEmpty({ message: 'CEP não pode estar vazio' })
  @Length(8, 9, { message: 'CEP deve ter 8 ou 9 caracteres' })
  @Matches(/^\d{5}-?\d{3}$/, { message: 'CEP inválido (formato: 12345-678 ou 12345678)' })
  zipCode: string;

  @ApiProperty({ example: 'Rua das Flores', description: 'Nome da rua' })
  @IsString({ message: 'Nome da rua deve ser uma string' })
  @IsNotEmpty({ message: 'Nome da rua não pode estar vazio' })
  streetName: string;

  @ApiProperty({ example: '123', description: 'Número do endereço' })
  @IsString({ message: 'Número deve ser uma string' })
  @IsNotEmpty({ message: 'Número não pode estar vazio' })
  number: string;

  @ApiProperty({ example: 'Sala 101', description: 'Complemento (opcional)', required: false })
  @IsString({ message: 'Complemento deve ser uma string' })
  @IsOptional()
  complement?: string;

  @ApiProperty({ example: 'Centro', description: 'Bairro' })
  @IsString({ message: 'Bairro deve ser uma string' })
  @IsNotEmpty({ message: 'Bairro não pode estar vazio' })
  neighborhood: string;

  @ApiProperty({ example: 'São Paulo', description: 'Cidade' })
  @IsString({ message: 'Cidade deve ser uma string' })
  @IsNotEmpty({ message: 'Cidade não pode estar vazia' })
  city: string;

  @ApiProperty({ example: 'SP', description: 'Estado (UF - 2 caracteres)' })
  @IsString({ message: 'Estado deve ser uma string' })
  @IsNotEmpty({ message: 'Estado não pode estar vazio' })
  @Length(2, 2, { message: 'Estado deve ter 2 caracteres (UF)' })
  @Matches(/^[A-Z]{2}$/, { message: 'Estado deve ser uma UF válida (ex: SP)' })
  state: string;
}
