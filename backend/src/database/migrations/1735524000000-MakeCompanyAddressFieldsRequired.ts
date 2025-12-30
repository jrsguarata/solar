import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeCompanyAddressFieldsRequired1735524000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Alterar colunas de endereço para NOT NULL
    await queryRunner.query(`
      ALTER TABLE companies
      ALTER COLUMN zip_code SET NOT NULL,
      ALTER COLUMN street_name SET NOT NULL,
      ALTER COLUMN city SET NOT NULL,
      ALTER COLUMN state SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter colunas para nullable
    await queryRunner.query(`
      ALTER TABLE companies
      ALTER COLUMN zip_code DROP NOT NULL,
      ALTER COLUMN street_name DROP NOT NULL,
      ALTER COLUMN city DROP NOT NULL,
      ALTER COLUMN state DROP NOT NULL
    `);
  }
}
