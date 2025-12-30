import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreatePlantsTable1735528000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'plants',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'installed_power',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '8',
          },
          {
            name: 'street_name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'state',
            type: 'varchar',
            length: '2',
          },
          {
            name: 'latitude',
            type: 'decimal',
            precision: 10,
            scale: 7,
            isNullable: true,
          },
          {
            name: 'longitude',
            type: 'decimal',
            precision: 10,
            scale: 7,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_by',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Criar índice para company_id
    await queryRunner.createIndex(
      'plants',
      new TableIndex({
        name: 'IDX_plants_company_id',
        columnNames: ['company_id'],
      }),
    );

    // Foreign key para companies
    await queryRunner.createForeignKey(
      'plants',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'RESTRICT',
      }),
    );

    // Foreign keys para auditoria
    await queryRunner.createForeignKey(
      'plants',
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'plants',
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'plants',
      new TableForeignKey({
        columnNames: ['deleted_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('plants');
  }
}
