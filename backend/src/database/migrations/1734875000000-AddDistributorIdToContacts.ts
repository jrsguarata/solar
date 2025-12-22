import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddDistributorIdToContacts1734875000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna distributorId
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'distributorId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Criar foreign key para a tabela distributors
    await queryRunner.createForeignKey(
      'contacts',
      new TableForeignKey({
        columnNames: ['distributorId'],
        referencedTableName: 'distributors',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Buscar foreign key
    const table = await queryRunner.getTable('contacts');

    if (table) {
      const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('distributorId') !== -1);

      // Remover foreign key
      if (foreignKey) {
        await queryRunner.dropForeignKey('contacts', foreignKey);
      }
    }

    // Remover coluna
    await queryRunner.dropColumn('contacts', 'distributorId');
  }
}
