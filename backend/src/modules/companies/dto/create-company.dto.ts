import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'COMP001' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Empresa Solar Ltda' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '12.345.678/0001-90' })
  @IsString()
  @IsNotEmpty()
  @Length(14, 18)
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, {
    message: 'CNPJ must be in format XX.XXX.XXX/XXXX-XX or 14 digits',
  })
  cnpj: string;
}
