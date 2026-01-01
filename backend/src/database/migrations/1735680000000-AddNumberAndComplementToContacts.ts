import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddNumberAndComplementToContacts1735680000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adicionar campo number (obrigatório)
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'number',
        type: 'varchar',
        isNullable: false,
        default: "''",
      }),
    );

    // Adicionar campo complement (opcional)
    await queryRunner.addColumn(
      'contacts',
      new TableColumn({
        name: 'complement',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover colunas na ordem inversa
    await queryRunner.dropColumn('contacts', 'complement');
    await queryRunner.dropColumn('contacts', 'number');
  }
}
