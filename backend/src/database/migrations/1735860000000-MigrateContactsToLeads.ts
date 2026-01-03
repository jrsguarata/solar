import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class MigrateContactsToLeads1735860000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ═══════════════════════════════════════════════════════════
    // PASSO 1: RENOMEAR TABELA contacts → leads
    // ═══════════════════════════════════════════════════════════

    await queryRunner.query(`ALTER TABLE contacts RENAME TO leads`);
    await queryRunner.query(`ALTER TABLE contact_notes RENAME TO lead_notes`);
    await queryRunner.query(`ALTER TABLE contact_proposals RENAME TO lead_proposals`);

    // Renomear colunas de FK nas tabelas relacionadas
    await queryRunner.query(`ALTER TABLE lead_notes RENAME COLUMN contact_id TO lead_id`);
    await queryRunner.query(`ALTER TABLE lead_proposals RENAME COLUMN contact_id TO lead_id`);

    // Renomear constraints de FK
    await queryRunner.query(`ALTER TABLE lead_notes DROP CONSTRAINT IF EXISTS FK_contact_notes_contact`);
    await queryRunner.query(`ALTER TABLE lead_notes ADD CONSTRAINT FK_lead_notes_lead
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE`);

    await queryRunner.query(`ALTER TABLE lead_proposals DROP CONSTRAINT IF EXISTS FK_contact_proposals_contact`);
    await queryRunner.query(`ALTER TABLE lead_proposals ADD CONSTRAINT FK_lead_proposals_lead
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE`);

    // Renomear índices
    await queryRunner.query(`DROP INDEX IF EXISTS idx_contact_notes_contact_id`);
    await queryRunner.query(`CREATE INDEX idx_lead_notes_lead_id ON lead_notes(lead_id)`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_contact_proposals_contact_id`);
    await queryRunner.query(`CREATE INDEX idx_lead_proposals_lead_id ON lead_proposals(lead_id)`);

    // ═══════════════════════════════════════════════════════════
    // PASSO 2: ADICIONAR NOVOS CAMPOS - ORIGEM E PROPRIEDADE
    // ═══════════════════════════════════════════════════════════

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'source',
        type: 'varchar',
        length: '50',
        default: "'LANDING_PAGE'",
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'owner_type',
        type: 'varchar',
        length: '50',
        default: "'EMPRESA'",
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'owner_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // FK: owner_id → companies (partner)
    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        name: 'FK_leads_owner',
        columnNames: ['owner_id'],
        referencedTableName: 'companies',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // ═══════════════════════════════════════════════════════════
    // PASSO 3: ADICIONAR CAMPOS DE QUALIFICAÇÃO (LEAD → SUSPECT)
    // ═══════════════════════════════════════════════════════════

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'distributor_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'monthly_consumption_kwh',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    );

    // FK: distributor_id → distributors
    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        name: 'FK_leads_distributor',
        columnNames: ['distributor_id'],
        referencedTableName: 'distributors',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // ═══════════════════════════════════════════════════════════
    // PASSO 4: ADICIONAR CAMPOS DE DISPONIBILIDADE (SUSPECT → PROSPECT)
    // ═══════════════════════════════════════════════════════════

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'cooperative_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'has_availability',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    );

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'available_energy_kwh',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    );

    // FK: cooperative_id → cooperatives
    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        name: 'FK_leads_cooperative',
        columnNames: ['cooperative_id'],
        referencedTableName: 'cooperatives',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // ═══════════════════════════════════════════════════════════
    // PASSO 5: ADICIONAR CAMPOS DE PROPOSTA (PROSPECT)
    // ═══════════════════════════════════════════════════════════

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'proposed_quota_kwh',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'monthly_value',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'monthly_savings',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    );

    // ═══════════════════════════════════════════════════════════
    // PASSO 6: ADICIONAR CAMPOS DE GESTÃO DO FUNIL
    // ═══════════════════════════════════════════════════════════

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'assigned_to',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'next_action_date',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'next_action_description',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    // FK: assigned_to → users
    await queryRunner.createForeignKey(
      'leads',
      new TableForeignKey({
        name: 'FK_leads_assigned_to',
        columnNames: ['assigned_to'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // ═══════════════════════════════════════════════════════════
    // PASSO 7: ADICIONAR CAMPOS DE CONVERSÃO
    // ═══════════════════════════════════════════════════════════

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'converted_to_client_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'leads',
      new TableColumn({
        name: 'converted_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    // ═══════════════════════════════════════════════════════════
    // PASSO 8: ATUALIZAR ENUM DE STATUS
    // ═══════════════════════════════════════════════════════════

    // Dropar constraint antiga
    await queryRunner.query(`ALTER TABLE leads DROP CONSTRAINT IF EXISTS contacts_status_check`);

    // Criar novo enum de status
    await queryRunner.query(`
      ALTER TABLE leads
      ADD CONSTRAINT leads_status_check
      CHECK (status IN ('LEAD', 'SUSPECT', 'PROSPECT', 'CLIENTE', 'SEM_COBERTURA', 'DESCARTADO'))
    `);

    // ═══════════════════════════════════════════════════════════
    // PASSO 9: MIGRAR DADOS EXISTENTES
    // ═══════════════════════════════════════════════════════════

    // PENDING → LEAD (novo contato, ainda não triado)
    await queryRunner.query(`UPDATE leads SET status = 'LEAD' WHERE status = 'PENDING'`);

    // READ → SUSPECT (já foi lido e triado)
    await queryRunner.query(`UPDATE leads SET status = 'SUSPECT' WHERE status = 'READ'`);

    // SUSPECT → SUSPECT (mantém)
    // Já está correto

    // RESOLVED → DESCARTADO (encerrado sem venda)
    await queryRunner.query(`UPDATE leads SET status = 'DESCARTADO' WHERE status = 'RESOLVED'`);

    // Definir source como LANDING_PAGE para todos os registros existentes
    await queryRunner.query(`UPDATE leads SET source = 'LANDING_PAGE' WHERE source IS NULL`);

    // Definir owner_type como EMPRESA para todos os registros existentes
    await queryRunner.query(`UPDATE leads SET owner_type = 'EMPRESA' WHERE owner_type IS NULL`);

    // ═══════════════════════════════════════════════════════════
    // PASSO 10: CRIAR ÍNDICES PARA PERFORMANCE
    // ═══════════════════════════════════════════════════════════

    await queryRunner.query(`CREATE INDEX idx_leads_status ON leads(status)`);
    await queryRunner.query(`CREATE INDEX idx_leads_owner_type ON leads(owner_type)`);
    await queryRunner.query(`CREATE INDEX idx_leads_owner_id ON leads(owner_id) WHERE owner_id IS NOT NULL`);
    await queryRunner.query(`CREATE INDEX idx_leads_distributor_id ON leads(distributor_id) WHERE distributor_id IS NOT NULL`);
    await queryRunner.query(`CREATE INDEX idx_leads_cooperative_id ON leads(cooperative_id) WHERE cooperative_id IS NOT NULL`);
    await queryRunner.query(`CREATE INDEX idx_leads_assigned_to ON leads(assigned_to) WHERE assigned_to IS NOT NULL`);
    await queryRunner.query(`CREATE INDEX idx_leads_next_action_date ON leads(next_action_date) WHERE next_action_date IS NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ═══════════════════════════════════════════════════════════
    // ROLLBACK: REVERTER TODAS AS MUDANÇAS
    // ═══════════════════════════════════════════════════════════

    // Dropar índices
    await queryRunner.query(`DROP INDEX IF EXISTS idx_leads_next_action_date`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_leads_assigned_to`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_leads_cooperative_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_leads_distributor_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_leads_owner_id`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_leads_owner_type`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_leads_status`);

    // Reverter migração de dados (LEAD → PENDING, SUSPECT → READ, DESCARTADO → RESOLVED)
    await queryRunner.query(`UPDATE leads SET status = 'PENDING' WHERE status = 'LEAD'`);
    await queryRunner.query(`UPDATE leads SET status = 'READ' WHERE status = 'SUSPECT'`);
    await queryRunner.query(`UPDATE leads SET status = 'RESOLVED' WHERE status = 'DESCARTADO'`);

    // Restaurar constraint de status antiga
    await queryRunner.query(`ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check`);
    await queryRunner.query(`
      ALTER TABLE leads
      ADD CONSTRAINT contacts_status_check
      CHECK (status IN ('PENDING', 'READ', 'SUSPECT', 'RESOLVED'))
    `);

    // Dropar colunas de conversão
    await queryRunner.dropColumn('leads', 'converted_at');
    await queryRunner.dropColumn('leads', 'converted_to_client_id');

    // Dropar colunas de gestão do funil
    await queryRunner.dropForeignKey('leads', 'FK_leads_assigned_to');
    await queryRunner.dropColumn('leads', 'next_action_description');
    await queryRunner.dropColumn('leads', 'next_action_date');
    await queryRunner.dropColumn('leads', 'assigned_to');

    // Dropar colunas de proposta
    await queryRunner.dropColumn('leads', 'monthly_savings');
    await queryRunner.dropColumn('leads', 'monthly_value');
    await queryRunner.dropColumn('leads', 'proposed_quota_kwh');

    // Dropar colunas de disponibilidade
    await queryRunner.dropForeignKey('leads', 'FK_leads_cooperative');
    await queryRunner.dropColumn('leads', 'available_energy_kwh');
    await queryRunner.dropColumn('leads', 'has_availability');
    await queryRunner.dropColumn('leads', 'cooperative_id');

    // Dropar colunas de qualificação
    await queryRunner.dropForeignKey('leads', 'FK_leads_distributor');
    await queryRunner.dropColumn('leads', 'monthly_consumption_kwh');
    await queryRunner.dropColumn('leads', 'distributor_id');

    // Dropar colunas de propriedade
    await queryRunner.dropForeignKey('leads', 'FK_leads_owner');
    await queryRunner.dropColumn('leads', 'owner_id');
    await queryRunner.dropColumn('leads', 'owner_type');
    await queryRunner.dropColumn('leads', 'source');

    // Reverter renomeação de índices
    await queryRunner.query(`DROP INDEX IF EXISTS idx_lead_proposals_lead_id`);
    await queryRunner.query(`CREATE INDEX idx_contact_proposals_contact_id ON lead_proposals(lead_id)`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_lead_notes_lead_id`);
    await queryRunner.query(`CREATE INDEX idx_contact_notes_contact_id ON lead_notes(lead_id)`);

    // Reverter renomeação de constraints de FK
    await queryRunner.query(`ALTER TABLE lead_proposals DROP CONSTRAINT IF EXISTS FK_lead_proposals_lead`);
    await queryRunner.query(`ALTER TABLE lead_proposals ADD CONSTRAINT FK_contact_proposals_contact
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE`);

    await queryRunner.query(`ALTER TABLE lead_notes DROP CONSTRAINT IF EXISTS FK_lead_notes_lead`);
    await queryRunner.query(`ALTER TABLE lead_notes ADD CONSTRAINT FK_contact_notes_contact
      FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE`);

    // Reverter renomeação de colunas
    await queryRunner.query(`ALTER TABLE lead_proposals RENAME COLUMN lead_id TO contact_id`);
    await queryRunner.query(`ALTER TABLE lead_notes RENAME COLUMN lead_id TO contact_id`);

    // Reverter renomeação de tabelas
    await queryRunner.query(`ALTER TABLE lead_proposals RENAME TO contact_proposals`);
    await queryRunner.query(`ALTER TABLE lead_notes RENAME TO contact_notes`);
    await queryRunner.query(`ALTER TABLE leads RENAME TO contacts`);
  }
}
