import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateContactProposalsTable1735855000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela contact_proposals
    await queryRunner.createTable(
      new Table({
        name: 'contact_proposals',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'contact_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'version',
            type: 'int',
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
            length: '500',
            isNullable: false,
          },
          {
            name: 'file_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'file_size',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'sent_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'sent_by',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Foreign Key: contact_id -> contacts
    await queryRunner.createForeignKey(
      'contact_proposals',
      new TableForeignKey({
        name: 'FK_contact_proposals_contact',
        columnNames: ['contact_id'],
        referencedTableName: 'contacts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Foreign Key: sent_by -> users
    await queryRunner.createForeignKey(
      'contact_proposals',
      new TableForeignKey({
        name: 'FK_contact_proposals_sent_by',
        columnNames: ['sent_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Índice para buscar propostas de um contato específico
    await queryRunner.query(
      `CREATE INDEX idx_contact_proposals_contact_id ON contact_proposals(contact_id)`,
    );

    // Índice para buscar por versão (último = MAX version)
    await queryRunner.query(
      `CREATE INDEX idx_contact_proposals_version ON contact_proposals(contact_id, version DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Dropar índices
    await queryRunner.query(`DROP INDEX IF EXISTS idx_contact_proposals_version`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_contact_proposals_contact_id`);

    // Dropar Foreign Keys
    await queryRunner.dropForeignKey('contact_proposals', 'FK_contact_proposals_sent_by');
    await queryRunner.dropForeignKey('contact_proposals', 'FK_contact_proposals_contact');

    // Dropar tabela
    await queryRunner.dropTable('contact_proposals');
  }
}
