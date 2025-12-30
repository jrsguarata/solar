import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from 'typeorm';

export class AddPlantIdToCooperatives1735582000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna plant_id
    await queryRunner.addColumn(
      'cooperatives',
      new TableColumn({
        name: 'plant_id',
        type: 'uuid',
        isNullable: false,
      }),
    );

    // Criar índice na coluna plant_id
    await queryRunner.createIndex(
      'cooperatives',
      new TableIndex({
        name: 'IDX_cooperatives_plant_id',
        columnNames: ['plant_id'],
      }),
    );

    // Criar foreign key para plants
    await queryRunner.createForeignKey(
      'cooperatives',
      new TableForeignKey({
        columnNames: ['plant_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'plants',
        onDelete: 'RESTRICT',
        name: 'FK_cooperatives_plant',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover foreign key
    await queryRunner.dropForeignKey('cooperatives', 'FK_cooperatives_plant');

    // Remover índice
    await queryRunner.dropIndex('cooperatives', 'IDX_cooperatives_plant_id');

    // Remover coluna
    await queryRunner.dropColumn('cooperatives', 'plant_id');
  }
}
