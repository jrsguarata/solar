import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddPartnerIdToUsers1735846000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar coluna partner_id na tabela users
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'partner_id',
        type: 'uuid',
        isNullable: true,
      })
    );

    // Criar foreign key para partners
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'FK_users_partner',
        columnNames: ['partner_id'],
        referencedTableName: 'partners',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      })
    );

    // Criar índice para melhor performance em queries
    await queryRunner.query(`CREATE INDEX "IDX_users_partner_id" ON "users" ("partner_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover índice
    await queryRunner.query(`DROP INDEX "IDX_users_partner_id"`);

    // Remover foreign key
    await queryRunner.dropForeignKey('users', 'FK_users_partner');

    // Remover coluna
    await queryRunner.dropColumn('users', 'partner_id');
  }
}
