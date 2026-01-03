import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateContactsTableAddNoteAndUpdateStatus1735848000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna note
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'note',
        type: 'text',
        isNullable: true,
      }),
    );

    // Atualizar enum de status (remover CONTACTED, adicionar READ e SUSPECT)
    // Primeiro, alterar a coluna para text temporariamente
    await queryRunner.query(`
      ALTER TABLE contacts
      ALTER COLUMN status TYPE text;
    `);

    // Atualizar valores existentes CONTACTED para READ
    await queryRunner.query(`
      UPDATE contacts
      SET status = 'READ'
      WHERE status = 'CONTACTED';
    `);

    // Recriar o enum com os novos valores
    await queryRunner.query(`
      DROP TYPE IF EXISTS "contacts_status_enum" CASCADE;
    `);

    await queryRunner.query(`
      CREATE TYPE "contacts_status_enum" AS ENUM ('PENDING', 'READ', 'SUSPECT', 'RESOLVED');
    `);

    // Alterar a coluna de volta para enum
    await queryRunner.query(`
      ALTER TABLE contacts
      ALTER COLUMN status TYPE "contacts_status_enum"
      USING status::"contacts_status_enum";
    `);

    // Definir valor padrão
    await queryRunner.query(`
      ALTER TABLE contacts
      ALTER COLUMN status SET DEFAULT 'PENDING';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover coluna note
    await queryRunner.dropColumn('contacts', 'note');

    // Reverter enum de status
    await queryRunner.query(`
      ALTER TABLE contacts
      ALTER COLUMN status TYPE text;
    `);

    // Atualizar valores READ de volta para CONTACTED
    await queryRunner.query(`
      UPDATE contacts
      SET status = 'CONTACTED'
      WHERE status = 'READ';
    `);

    // Atualizar valores SUSPECT para CONTACTED (não há correspondência exata)
    await queryRunner.query(`
      UPDATE contacts
      SET status = 'CONTACTED'
      WHERE status = 'SUSPECT';
    `);

    // Recriar o enum original
    await queryRunner.query(`
      DROP TYPE IF EXISTS "contacts_status_enum" CASCADE;
    `);

    await queryRunner.query(`
      CREATE TYPE "contacts_status_enum" AS ENUM ('PENDING', 'CONTACTED', 'RESOLVED');
    `);

    await queryRunner.query(`
      ALTER TABLE contacts
      ALTER COLUMN status TYPE "contacts_status_enum"
      USING status::"contacts_status_enum";
    `);

    await queryRunner.query(`
      ALTER TABLE contacts
      ALTER COLUMN status SET DEFAULT 'PENDING';
    `);
  }
}
