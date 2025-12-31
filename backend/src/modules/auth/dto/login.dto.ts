import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email não pode estar vazio' })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha não pode estar vazia' })
  password: string;

  @ApiProperty({
    example: 'uuid-da-empresa',
    description: 'ID da empresa (opcional, usado para validar login de usuários não-admin)',
    required: false
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID da empresa deve ser um UUID válido' })
  companyId?: string;
}
