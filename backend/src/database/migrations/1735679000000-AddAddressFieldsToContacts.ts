import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAddressFieldsToContacts1735679000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar campos de endereço
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'cep',
        type: 'varchar',
        length: '9',
        isNullable: false,
        default: "''",
      }),
    );

    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'street',
        type: 'varchar',
        isNullable: false,
        default: "''",
      }),
    );

    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'neighborhood',
        type: 'varchar',
        isNullable: false,
        default: "''",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover colunas na ordem inversa
    await queryRunner.dropColumn('contacts', 'neighborhood');
    await queryRunner.dropColumn('contacts', 'street');
    await queryRunner.dropColumn('contacts', 'cep');
  }
}
