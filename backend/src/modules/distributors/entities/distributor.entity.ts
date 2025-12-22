import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('distributors')
export class Distributor {
  @ApiProperty({
    description: 'Identificador único da distribuidora',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Código da distribuidora',
    example: 'CPFL',
    required: false,
  })
  @Column({ length: 50, nullable: true })
  code: string;

  @ApiProperty({
    description: 'Unidade Federativa (Estado)',
    example: 'SP',
    required: false,
  })
  @Column({ length: 50, nullable: true })
  uf: string;

  @ApiProperty({
    description: 'Nome da distribuidora',
    example: 'CPFL Paulista',
  })
  @Column({ length: 128, nullable: true })
  name: string;

  @ApiProperty({
    description: 'Tipo da distribuidora',
    example: 'Energia Elétrica',
    required: false,
  })
  @Column({ length: 50, nullable: true })
  type: string;
}
