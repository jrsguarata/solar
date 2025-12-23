import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: '+5511999999999',
    description: 'Telefone do usuário',
  })
  @IsString({ message: 'Telefone deve ser uma string válida' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  phone: string;

  @ApiProperty({
    example: '123456',
    description: 'Código de 6 dígitos enviado por SMS',
  })
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Código deve conter 6 dígitos' })
  code: string;

  @ApiProperty({
    example: 'NovaSenha123!',
    description: 'Nova senha (mínimo 8 caracteres)',
  })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  newPassword: string;
}
