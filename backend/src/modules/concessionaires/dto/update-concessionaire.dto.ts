import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateConcessionaireDto } from './create-concessionaire.dto';

export class UpdateConcessionaireDto extends PartialType(
  CreateConcessionaireDto,
) {
  @ApiProperty({
    example: true,
    description: 'Status de ativação da concessionária',
    required: false
  })
  @IsBoolean({ message: 'isActive deve ser um boolean' })
  @IsOptional()
  isActive?: boolean;
}
