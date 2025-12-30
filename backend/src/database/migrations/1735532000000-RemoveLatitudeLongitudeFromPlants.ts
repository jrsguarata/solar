import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class RemoveLatitudeLongitudeFromPlants1735532000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('plants', 'latitude');
    await queryRunner.dropColumn('plants', 'longitude');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'plants',
      new TableColumn({
        name: 'latitude',
        type: 'decimal',
        precision: 10,
        scale: 7,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'plants',
      new TableColumn({
        name: 'longitude',
        type: 'decimal',
        precision: 10,
        scale: 7,
        isNullable: true,
      }),
    );
  }
}
