import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAddressFieldsToCompanies1735520000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('companies', [
      new TableColumn({
        name: 'zip_code',
        type: 'varchar',
        length: '8',
        isNullable: true,
      }),
      new TableColumn({
        name: 'street_name',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
      new TableColumn({
        name: 'city',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
      new TableColumn({
        name: 'state',
        type: 'varchar',
        length: '2',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('companies', 'state');
    await queryRunner.dropColumn('companies', 'city');
    await queryRunner.dropColumn('companies', 'street_name');
    await queryRunner.dropColumn('companies', 'zip_code');
  }
}
