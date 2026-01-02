import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAddressFieldsAndSoftDeleteToCooperatives1735686000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar novos campos de endereço
    await queryRunner.query(`
      ALTER TABLE cooperatives
      ADD COLUMN number VARCHAR(10),
      ADD COLUMN complement VARCHAR(100),
      ADD COLUMN neighborhood VARCHAR(100)
    `);

    // Adicionar campo isActive
    await queryRunner.query(`
      ALTER TABLE cooperatives
      ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true
    `);

    // Adicionar campos de soft delete (deactivated_at já existe como deleted_at da BaseEntity)
    // Renomear deleted_at para deactivated_at para consistência
    await queryRunner.query(`
      ALTER TABLE cooperatives
      RENAME COLUMN deleted_at TO deactivated_at
    `);

    // Adicionar deactivated_by com FK para users
    await queryRunner.query(`
      ALTER TABLE cooperatives
      ADD COLUMN deactivated_by UUID,
      ADD CONSTRAINT fk_cooperatives_deactivated_by_user
      FOREIGN KEY (deactivated_by) REFERENCES users(id) ON DELETE SET NULL
    `);

    // Atualizar registros existentes para preencher os novos campos obrigatórios
    await queryRunner.query(`
      UPDATE cooperatives
      SET number = '0', neighborhood = 'N/A'
      WHERE number IS NULL OR neighborhood IS NULL
    `);

    // Tornar os campos obrigatórios
    await queryRunner.query(`
      ALTER TABLE cooperatives
      ALTER COLUMN number SET NOT NULL,
      ALTER COLUMN neighborhood SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover FK de deactivated_by
    await queryRunner.query(`
      ALTER TABLE cooperatives
      DROP CONSTRAINT IF EXISTS fk_cooperatives_deactivated_by_user
    `);

    // Remover deactivated_by
    await queryRunner.query(`
      ALTER TABLE cooperatives
      DROP COLUMN IF EXISTS deactivated_by
    `);

    // Renomear deactivated_at de volta para deleted_at
    await queryRunner.query(`
      ALTER TABLE cooperatives
      RENAME COLUMN deactivated_at TO deleted_at
    `);

    // Remover is_active
    await queryRunner.query(`
      ALTER TABLE cooperatives
      DROP COLUMN IF EXISTS is_active
    `);

    // Remover campos de endereço
    await queryRunner.query(`
      ALTER TABLE cooperatives
      DROP COLUMN IF EXISTS number,
      DROP COLUMN IF EXISTS complement,
      DROP COLUMN IF EXISTS neighborhood
    `);
  }
}
