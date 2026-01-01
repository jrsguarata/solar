import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddCompanyIdToContacts1735677000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna company_id
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'company_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Criar foreign key para a tabela companies
    await queryRunner.createForeignKey(
      'contacts',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Buscar foreign key
    const table = await queryRunner.getTable('contacts');

    if (table) {
      const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('company_id') !== -1);

      // Remover foreign key
      if (foreignKey) {
        await queryRunner.dropForeignKey('contacts', foreignKey);
      }
    }

    // Remover coluna
    await queryRunner.dropColumn('contacts', 'company_id');
  }
}
