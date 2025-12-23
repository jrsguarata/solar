import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'senhaAtual123',
    description: 'Senha atual do usuário',
  })
  @IsString({ message: 'Senha atual deve ser uma string' })
  currentPassword: string;

  @ApiProperty({
    example: 'novaSenha123',
    description: 'Nova senha (mínimo 8 caracteres)',
  })
  @IsString({ message: 'Nova senha deve ser uma string' })
  @MinLength(8, { message: 'Nova senha deve ter no mínimo 8 caracteres' })
  newPassword: string;
}
