import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class CreateCooperativesTable1735531000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cooperatives',
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
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'company_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'cnpj',
            type: 'varchar',
            length: '14',
            isNullable: false,
          },
          {
            name: 'zip_code',
            type: 'varchar',
            length: '8',
            isNullable: false,
          },
          {
            name: 'street_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'varchar',
            length: '2',
            isNullable: false,
          },
          {
            name: 'monthly_energy',
            type: 'decimal',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'foundation_date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'operation_approval_date',
            type: 'date',
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

    // Índice no company_id para performance
    await queryRunner.createIndex(
      'cooperatives',
      new TableIndex({
        name: 'IDX_COOPERATIVES_COMPANY_ID',
        columnNames: ['company_id'],
      }),
    );

    // Índice no cnpj para buscas
    await queryRunner.createIndex(
      'cooperatives',
      new TableIndex({
        name: 'IDX_COOPERATIVES_CNPJ',
        columnNames: ['cnpj'],
      }),
    );

    // Foreign key para company
    await queryRunner.createForeignKey(
      'cooperatives',
      new TableForeignKey({
        name: 'FK_COOPERATIVES_COMPANY',
        columnNames: ['company_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );

    // Foreign key para created_by
    await queryRunner.createForeignKey(
      'cooperatives',
      new TableForeignKey({
        name: 'FK_COOPERATIVES_CREATED_BY',
        columnNames: ['created_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    // Foreign key para updated_by
    await queryRunner.createForeignKey(
      'cooperatives',
      new TableForeignKey({
        name: 'FK_COOPERATIVES_UPDATED_BY',
        columnNames: ['updated_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    // Foreign key para deleted_by
    await queryRunner.createForeignKey(
      'cooperatives',
      new TableForeignKey({
        name: 'FK_COOPERATIVES_DELETED_BY',
        columnNames: ['deleted_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('cooperatives', 'FK_COOPERATIVES_DELETED_BY');
    await queryRunner.dropForeignKey('cooperatives', 'FK_COOPERATIVES_UPDATED_BY');
    await queryRunner.dropForeignKey('cooperatives', 'FK_COOPERATIVES_CREATED_BY');
    await queryRunner.dropForeignKey('cooperatives', 'FK_COOPERATIVES_COMPANY');
    await queryRunner.dropIndex('cooperatives', 'IDX_COOPERATIVES_CNPJ');
    await queryRunner.dropIndex('cooperatives', 'IDX_COOPERATIVES_COMPANY_ID');
    await queryRunner.dropTable('cooperatives');
  }
}
