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

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsString({ message: 'CNPJ deve ser uma string' })
  @IsNotEmpty({ message: 'CNPJ não pode estar vazio' })
  @Length(14, 18, { message: 'CNPJ deve ter entre 14 e 18 caracteres' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, {
    message: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX ou conter 14 dígitos',
  })
  cnpj: string;
}
