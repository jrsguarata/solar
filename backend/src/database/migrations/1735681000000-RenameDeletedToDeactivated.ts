import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameDeletedToDeactivated1735681000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Renomear colunas na tabela companies
    await queryRunner.query(`
      ALTER TABLE companies
      RENAME COLUMN deleted_at TO deactivated_at;
    `);
    await queryRunner.query(`
      ALTER TABLE companies
      RENAME COLUMN deleted_by TO deactivated_by;
    `);

    // Renomear colunas na tabela users
    await queryRunner.query(`
      ALTER TABLE users
      RENAME COLUMN deleted_at TO deactivated_at;
    `);
    await queryRunner.query(`
      ALTER TABLE users
      RENAME COLUMN deleted_by TO deactivated_by;
    `);

    // Renomear colunas na tabela contacts (se tiver)
    const contactsHasDeletedAt = await queryRunner.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'contacts' AND column_name = 'deleted_at';
    `);

    if (contactsHasDeletedAt.length > 0) {
      await queryRunner.query(`
        ALTER TABLE contacts
        RENAME COLUMN deleted_at TO deactivated_at;
      `);
      await queryRunner.query(`
        ALTER TABLE contacts
        RENAME COLUMN deleted_by TO deactivated_by;
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter renomeação na tabela companies
    await queryRunner.query(`
      ALTER TABLE companies
      RENAME COLUMN deactivated_at TO deleted_at;
    `);
    await queryRunner.query(`
      ALTER TABLE companies
      RENAME COLUMN deactivated_by TO deleted_by;
    `);

    // Reverter renomeação na tabela users
    await queryRunner.query(`
      ALTER TABLE users
      RENAME COLUMN deactivated_at TO deleted_at;
    `);
    await queryRunner.query(`
      ALTER TABLE users
      RENAME COLUMN deactivated_by TO deleted_by;
    `);

    // Reverter renomeação na tabela contacts (se existir)
    const contactsHasDeactivatedAt = await queryRunner.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'contacts' AND column_name = 'deactivated_at';
    `);

    if (contactsHasDeactivatedAt.length > 0) {
      await queryRunner.query(`
        ALTER TABLE contacts
        RENAME COLUMN deactivated_at TO deleted_at;
      `);
      await queryRunner.query(`
        ALTER TABLE contacts
        RENAME COLUMN deactivated_by TO deleted_by;
      `);
    }
  }
}
