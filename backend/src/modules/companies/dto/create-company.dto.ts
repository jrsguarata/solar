import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'COMP001' })
  @IsString({ message: 'Código deve ser uma string' })
  @IsNotEmpty({ message: 'Código não pode estar vazio' })
  code: string;

  @ApiProperty({ example: 'Empresa Solar Ltda' })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazio' })
  name: string;

  @ApiProperty({
    example: 'AB.345.678/0001-90',
    description: 'CNPJ no novo formato alfanumérico (12 caracteres alfanuméricos + 2 dígitos verificadores)'
  })
  @IsString({ message: 'CNPJ deve ser uma string' })
  @IsNotEmpty({ message: 'CNPJ não pode estar vazio' })
  @Length(14, 18, { message: 'CNPJ deve ter entre 14 e 18 caracteres' })
  @Matches(/^[A-Za-z0-9]{2}\.[A-Za-z0-9]{3}\.[A-Za-z0-9]{3}\/[A-Za-z0-9]{4}-\d{2}$|^[A-Za-z0-9]{12}\d{2}$/, {
    message: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-DD (12 caracteres alfanuméricos + 2 dígitos) ou conter 14 caracteres sem formatação',
  })
  cnpj: string;

  @ApiProperty({ example: '12345678', description: 'CEP (8 caracteres)' })
  @IsString({ message: 'CEP deve ser uma string' })
  @IsNotEmpty({ message: 'CEP não pode estar vazio' })
  @Length(8, 8, { message: 'CEP deve ter 8 caracteres' })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter apenas números' })
  zipCode: string;

  @ApiProperty({ example: 'Rua das Flores, 123', description: 'Nome da rua' })
  @IsString({ message: 'Nome da rua deve ser uma string' })
  @IsNotEmpty({ message: 'Nome da rua não pode estar vazio' })
  streetName: string;

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
