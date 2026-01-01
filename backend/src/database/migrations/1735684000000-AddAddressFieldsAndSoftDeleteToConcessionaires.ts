import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAddressFieldsAndSoftDeleteToConcessionaires1735684000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar campo number
    await queryRunner.addColumn(
      'concessionaires',
      new TableColumn({
        name: 'number',
        type: 'varchar',
        length: '50',
        isNullable: false,
        default: "'S/N'",
      }),
    );

    // Adicionar campo complement
    await queryRunner.addColumn(
      'concessionaires',
      new TableColumn({
        name: 'complement',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    );

    // Adicionar campo neighborhood
    await queryRunner.addColumn(
      'concessionaires',
      new TableColumn({
        name: 'neighborhood',
        type: 'varchar',
        length: '100',
        isNullable: false,
        default: "''",
      }),
    );

    // Adicionar campo is_active
    await queryRunner.addColumn(
      'concessionaires',
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        default: true,
        isNullable: false,
      }),
    );

    // Alterar zip_code para aceitar 9 caracteres (CEP com hífen)
    await queryRunner.changeColumn(
      'concessionaires',
      'zip_code',
      new TableColumn({
        name: 'zip_code',
        type: 'varchar',
        length: '9',
        isNullable: false,
      }),
    );

    // Remover defaults temporários
    await queryRunner.query(`
      ALTER TABLE concessionaires 
      ALTER COLUMN number DROP DEFAULT,
      ALTER COLUMN neighborhood DROP DEFAULT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter alterações
    await queryRunner.dropColumn('concessionaires', 'is_active');
    await queryRunner.dropColumn('concessionaires', 'neighborhood');
    await queryRunner.dropColumn('concessionaires', 'complement');
    await queryRunner.dropColumn('concessionaires', 'number');

    // Reverter zip_code para 8 caracteres
    await queryRunner.changeColumn(
      'concessionaires',
      'zip_code',
      new TableColumn({
        name: 'zip_code',
        type: 'varchar',
        length: '8',
        isNullable: false,
      }),
    );
  }
}
