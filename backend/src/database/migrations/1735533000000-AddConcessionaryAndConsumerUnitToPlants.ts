import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class AddConcessionaryAndConsumerUnitToPlants1735533000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna concessionary_id
    await queryRunner.addColumn(
      'plants',
      new TableColumn({
        name: 'concessionary_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    // Adicionar coluna consumer_unit
    await queryRunner.addColumn(
      'plants',
      new TableColumn({
        name: 'consumer_unit',
        type: 'varchar',
        isNullable: false,
      }),
    );

    // Criar índice em concessionary_id
    await queryRunner.createIndex(
      'plants',
      new TableIndex({
        name: 'IDX_PLANTS_CONCESSIONARY_ID',
        columnNames: ['concessionary_id'],
      }),
    );

    // Criar foreign key para concessionaire
    await queryRunner.createForeignKey(
      'plants',
      new TableForeignKey({
        name: 'FK_PLANTS_CONCESSIONARY',
        columnNames: ['concessionary_id'],
        referencedTableName: 'concessionaires',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign key
    await queryRunner.dropForeignKey('plants', 'FK_PLANTS_CONCESSIONARY');

    // Remover índice
    await queryRunner.dropIndex('plants', 'IDX_PLANTS_CONCESSIONARY_ID');

    // Remover colunas
    await queryRunner.dropColumn('plants', 'consumer_unit');
    await queryRunner.dropColumn('plants', 'concessionary_id');
  }
}
