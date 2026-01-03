import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContactStatus } from '../entities/contact.entity';

export class UpdateContactDto {
  @ApiProperty({
    example: 'READ',
    enum: ContactStatus,
    description: 'Status do contato',
    required: false,
  })
  @IsOptional()
  @IsEnum(ContactStatus, {
    message: 'Status deve ser PENDING, READ, SUSPECT ou RESOLVED',
  })
  status?: ContactStatus;

  @ApiProperty({
    example: 'Cliente demonstrou interesse em energia solar para empresa de médio porte',
    description: 'Anotações sobre o contato',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Nota deve ser uma string' })
  note?: string;
}
