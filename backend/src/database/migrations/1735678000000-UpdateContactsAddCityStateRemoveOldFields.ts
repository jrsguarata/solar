import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class UpdateContactsAddCityStateRemoveOldFields1735678000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar colunas city e state
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'city',
        type: 'varchar',
        isNullable: false,
        default: "''",
      }),
    );

    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'state',
        type: 'varchar',
        length: '2',
        isNullable: false,
        default: "''",
      }),
    );

    // Remover foreign key de distributorId se existir
    const table = await queryRunner.getTable('contacts');
    if (table) {
      const distributorFk = table.foreignKeys.find((fk) => fk.columnNames.indexOf('distributorId') !== -1);
      if (distributorFk) {
        await queryRunner.dropForeignKey('contacts', distributorFk);
      }
    }

    // Remover colunas company e distributorId
    await queryRunner.dropColumn('contacts', 'company');
    await queryRunner.dropColumn('contacts', 'distributorId');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recriar colunas company e distributorId
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'company',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'distributorId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Recriar foreign key para distributors
    await queryRunner.createForeignKey(
      'contacts',
      new TableForeignKey({
        columnNames: ['distributorId'],
        referencedTableName: 'distributors',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // Remover colunas city e state
    await queryRunner.dropColumn('contacts', 'state');
    await queryRunner.dropColumn('contacts', 'city');
  }
}
