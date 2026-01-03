import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLeadsTable1735938000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela leads
    await queryRunner.createTable(
      new Table({
        name: 'leads',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          // Informações Pessoais
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'cpf',
            type: 'varchar',
            length: '11',
            isNullable: true,
          },
          {
            name: 'cnpj',
            type: 'varchar',
            length: '14',
            isNullable: true,
          },
          // Informações da Empresa (B2B)
          {
            name: 'company_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'company_size',
            type: 'varchar',
            isNullable: true,
          },
          // Endereço
          {
            name: 'cep',
            type: 'varchar',
            length: '9',
            isNullable: false,
          },
          {
            name: 'street',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'number',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'complement',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'neighborhood',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '2',
            isNullable: false,
          },
          // Informações de Energia
          {
            name: 'average_consumption_kwh',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'average_bill_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'concessionaire',
            type: 'varchar',
            isNullable: true,
          },
          // Status e Origem
          {
            name: 'status',
            type: 'enum',
            enum: ['LEAD', 'SUSPECT', 'PROSPECT', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST', 'ARCHIVED'],
            default: "'LEAD'",
          },
          {
            name: 'source',
            type: 'enum',
            enum: ['LANDING_PAGE', 'MANUAL', 'IMPORT', 'API', 'REFERRAL'],
            default: "'LANDING_PAGE'",
          },
          // Multi-tenant: Ownership
          {
            name: 'owner_type',
            type: 'enum',
            enum: ['EMPRESA', 'PARTNER'],
            default: "'EMPRESA'",
          },
          {
            name: 'owner_id',
            type: 'uuid',
            isNullable: true,
          },
          // Responsável
          {
            name: 'assigned_to',
            type: 'uuid',
            isNullable: true,
          },
          // Observações
          {
            name: 'message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          // Timestamps
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          // Auditoria
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Foreign Keys
    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        columnNames: ['owner_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        columnNames: ['assigned_to'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Criar tabela lead_notes
    await queryRunner.createTable(
      new Table({
        name: 'lead_notes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'lead_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'note',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'lead_notes',
      new TableForeignKey({
        columnNames: ['lead_id'],
        referencedTableName: 'leads',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'lead_notes',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Criar tabela lead_proposals
    await queryRunner.createTable(
      new Table({
        name: 'lead_proposals',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'lead_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'quota_kwh',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'monthly_value',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'monthly_savings',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'file_path',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'file_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'lead_proposals',
      new TableForeignKey({
        columnNames: ['lead_id'],
        referencedTableName: 'leads',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'lead_proposals',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('lead_proposals');
    await queryRunner.dropTable('lead_notes');
    await queryRunner.dropTable('leads');
  }
}
