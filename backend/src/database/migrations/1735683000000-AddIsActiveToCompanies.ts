import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddIsActiveToCompanies1735683000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna is_active à tabela companies
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        default: true,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover coluna is_active da tabela companies
    await queryRunner.dropColumn('companies', 'is_active');
  }
}
