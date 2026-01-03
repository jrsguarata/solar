import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateContactNotesTable1735850000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar tabela contact_notes
    await queryRunner.createTable(
      new Table({
        name: 'contact_notes',
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
            name: 'note',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Foreign key para contacts
    await queryRunner.createForeignKey(
      'contact_notes',
      new TableForeignKey({
        name: 'FK_contact_notes_contact',
        columnNames: ['contact_id'],
        referencedTableName: 'contacts',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Foreign key para users
    await queryRunner.createForeignKey(
      'contact_notes',
      new TableForeignKey({
        name: 'FK_contact_notes_user',
        columnNames: ['created_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    // Remover coluna 'note' da tabela contacts (se existir)
    const contactsTable = await queryRunner.getTable('contacts');
    const noteColumn = contactsTable?.findColumnByName('note');

    if (noteColumn) {
      await queryRunner.dropColumn('contacts', 'note');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna note de volta na tabela contacts
    await queryRunner.query(`
      ALTER TABLE contacts
      ADD COLUMN note text;
    `);

    // Remover foreign keys
    await queryRunner.dropForeignKey('contact_notes', 'FK_contact_notes_user');
    await queryRunner.dropForeignKey('contact_notes', 'FK_contact_notes_contact');

    // Remover tabela contact_notes
    await queryRunner.dropTable('contact_notes');
  }
}
