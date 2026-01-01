import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAddressFieldsToCompanies1735682000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Alterar zip_code de length 8 para 9 (permitir hífen)
    await queryRunner.query(`
      ALTER TABLE companies
      ALTER COLUMN zip_code TYPE varchar(9);
    `);

    // Adicionar campo number
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'number',
        type: 'varchar',
        length: '50',
        isNullable: false,
        default: "''",
      }),
    );

    // Adicionar campo complement (opcional)
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'complement',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    );

    // Adicionar campo neighborhood
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'neighborhood',
        type: 'varchar',
        length: '100',
        isNullable: false,
        default: "''",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover colunas na ordem inversa
    await queryRunner.dropColumn('companies', 'neighborhood');
    await queryRunner.dropColumn('companies', 'complement');
    await queryRunner.dropColumn('companies', 'number');

    // Reverter zip_code para length 8
    await queryRunner.query(`
      ALTER TABLE companies
      ALTER COLUMN zip_code TYPE varchar(8);
    `);
  }
}
