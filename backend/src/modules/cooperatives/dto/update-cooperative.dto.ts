import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateCooperativeDto } from './create-cooperative.dto';

export class UpdateCooperativeDto extends PartialType(CreateCooperativeDto) {
  @ApiProperty({
    example: true,
    description: 'Status de ativação da cooperativa',
    required: false
  })
  @IsBoolean({ message: 'isActive deve ser um boolean' })
  @IsOptional()
  isActive?: boolean;
}
