# Estratégia Completa de CRM - Pipeline de Vendas

## 📋 Visão Geral

Sistema completo de gestão do funil de vendas desde a captação de leads (manual ou automática) até a conversão em clientes ativos, com rastreabilidade total e histórico de follow-up.

---

## 🎯 Conceitos e Definições

### Lead
**Definição**: Contato inicial sem qualificação, pode vir de duas origens:
1. **Landing Page** (automático): Formulário preenchido pelo interessado
2. **Manual** (operador): Lista fornecida, indicação, evento, cold call, etc.

**Características**:
- Informações básicas (nome, email, telefone, cidade)
- Ainda não foi validado ou qualificado
- Pode ou não ter perfil de cliente

**Status Inicial**: `LEAD`

---

### Suspect
**Definição**: Lead que passou por triagem inicial e demonstra ter fit mínimo com perfil de cliente.

**Características**:
- Informações básicas validadas
- Fit inicial confirmado (região atendida, segmento alvo, etc.)
- Demonstrou interesse genuíno
- Pronto para processo de qualificação

**Status**: `SUSPECT`

---

### Prospect
**Definição**: Suspect qualificado após análise detalhada, com potencial real de conversão.

**Características**:
- Qualificação completa realizada (BANT: Budget, Authority, Need, Timeline)
- Interesse confirmado e mensurado
- Orçamento identificado
- Decisor identificado
- Necessidade clara e urgência definida
- Em processo ativo de negociação

**Status**: `PROSPECT`

---

### Cliente
**Definição**: Prospect que fechou negócio e assinou contrato.

**Características**:
- Contrato assinado
- Pagamento confirmado ou em andamento
- Em processo de implementação/entrega
- Vira registro na tabela `clients`

**Status**: Cliente ativo no sistema

---

## 📊 Funil Completo de Vendas

```
┌─────────────────────────────────────────────────────────────┐
│                      CAPTAÇÃO DE LEADS                       │
├──────────────────────┬──────────────────────────────────────┤
│  Landing Page        │  Manual (Operador)                   │
│  (Automático)        │  - Lista comprada                    │
│                      │  - Indicações                        │
│                      │  - Eventos                           │
│                      │  - Cold call                         │
└──────────────────────┴──────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │   LEAD (novo)   │ ← Status inicial
                    └─────────────────┘
                              ↓
                    [Triagem Inicial]
                    - Validar dados
                    - Verificar fit básico
                              ↓
              ┌───────────────┴───────────────┐
              ↓                               ↓
    ┌─────────────────┐            ┌─────────────────┐
    │    SUSPECT      │            │   DESCARTADO    │
    │  (qualificável) │            │  (não fit)      │
    └─────────────────┘            └─────────────────┘
              ↓
    [Qualificação BANT]
    - Budget (orçamento)
    - Authority (decisor)
    - Need (necessidade)
    - Timeline (prazo)
              ↓
    ┌─────────────────┐
    │    PROSPECT     │
    │  (qualificado)  │
    └─────────────────┘
              ↓
    [Negociação]
    - Proposta
    - Follow-ups
    - Objeções
              ↓
    ┌─────────────────┐
    │     CLIENTE     │
    │   (convertido)  │
    └─────────────────┘
```

---

## 🗂️ Estrutura de Dados

### Tabela: `leads`

Armazena TODOS os contatos (origem landing page OU manual).

```typescript
@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Origem do lead
  @Column({
    type: 'enum',
    enum: ['LANDING_PAGE', 'MANUAL', 'INDICACAO', 'EVENTO', 'LISTA', 'COLD_CALL', 'OUTRO'],
    name: 'source'
  })
  source: LeadSource;

  @Column({ nullable: true, name: 'source_details' })
  sourceDetails?: string; // Ex: "Lista XYZ", "Evento Solar 2026"

  // Dados básicos (obrigatórios)
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  city: string;

  @Column()
  state: string;

  // Dados adicionais (opcionais - vêm da landing page)
  @Column({ nullable: true })
  cep?: string;

  @Column({ nullable: true })
  street?: string;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  complement?: string;

  @Column({ nullable: true })
  neighborhood?: string;

  @Column({ type: 'text', nullable: true })
  message?: string; // Mensagem da landing page

  // Status do lead no funil
  @Column({
    type: 'enum',
    enum: ['LEAD', 'SUSPECT', 'PROSPECT', 'CLIENTE', 'DESCARTADO'],
    default: 'LEAD'
  })
  status: LeadStatus;

  // Empresa (multi-tenant)
  @Column({ name: 'company_id', nullable: true })
  companyId?: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company?: Company;

  // Vendedor responsável (atribuído na qualificação)
  @Column({ name: 'assigned_to', nullable: true })
  assignedTo?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedToUser?: User;

  // Próxima ação agendada
  @Column({ name: 'next_action_date', nullable: true })
  nextActionDate?: Date;

  @Column({ name: 'next_action_description', nullable: true })
  nextActionDescription?: string;

  // Dados de qualificação BANT (preenchidos quando vira PROSPECT)
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget?: number; // Orçamento estimado

  @Column({ nullable: true })
  authority?: string; // Nome do decisor

  @Column({ type: 'text', nullable: true })
  need?: string; // Descrição da necessidade

  @Column({ nullable: true })
  timeline?: string; // Ex: "30 dias", "3 meses"

  // Score de qualificação (0-100)
  @Column({ type: 'int', default: 0 })
  score: number;

  // Notas (relacionamento)
  @OneToMany(() => LeadNote, (note) => note.lead)
  notes: LeadNote[];

  // Auditoria
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: User;

  // Quando virar cliente
  @Column({ name: 'converted_to_client_id', nullable: true })
  convertedToClientId?: string;

  @Column({ name: 'converted_at', nullable: true })
  convertedAt?: Date;
}
```

### Tabela: `lead_notes`

Idêntica ao sistema de `contact_notes`, mas para leads.

```typescript
@Entity('lead_notes')
export class LeadNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'lead_id' })
  leadId: string;

  @ManyToOne(() => Lead, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column('text')
  note: string;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### Tabela: `clients`

Clientes convertidos (futuro - Sprint 3).

```typescript
@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Referência ao lead original
  @Column({ name: 'lead_id' })
  leadId: string;

  @ManyToOne(() => Lead)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  // Dados do contrato
  @Column({ name: 'contract_number', unique: true })
  contractNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  contractValue: number;

  @Column({ name: 'contract_date' })
  contractDate: Date;

  @Column({ name: 'start_date', nullable: true })
  startDate?: Date;

  @Column({
    type: 'enum',
    enum: ['ATIVO', 'INATIVO', 'SUSPENSO', 'CANCELADO'],
    default: 'ATIVO'
  })
  status: ClientStatus;

  // Empresa
  @Column({ name: 'company_id' })
  companyId: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  // Gestor de conta
  @Column({ name: 'account_manager_id' })
  accountManagerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'account_manager_id' })
  accountManager: User;

  // Auditoria
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## 🔄 Fluxos de Trabalho

### Fluxo 1: Lead da Landing Page (Automático)

**Passo 1: Captura**
- Usuário preenche formulário na landing page `/EMP01`
- Sistema cria registro na tabela `leads`:
  - `source: 'LANDING_PAGE'`
  - `status: 'LEAD'`
  - `companyId: 'empresa-da-landing-page'`
  - Todos os campos do formulário preenchidos
- Email automático enviado ao lead (confirmação)
- Notificação para equipe

**Passo 2: Triagem (24h)**
- COADMIN/OPERATOR acessa "Dashboard de Leads"
- Visualiza leads com status `LEAD`
- Abre modal de visualização
- Analisa perfil e fit inicial
- **Decisão**:
  - **Tem fit**: Muda status para `SUSPECT` + adiciona nota de triagem
  - **Não tem fit**: Muda status para `DESCARTADO` + adiciona motivo

**Passo 3: Qualificação (SUSPECT → PROSPECT)**
- COADMIN atribui lead para si (`assignedTo`)
- Realiza primeiro contato (telefone/email)
- Preenche dados BANT:
  - Budget (orçamento disponível)
  - Authority (quem decide)
  - Need (necessidade real)
  - Timeline (quando precisa)
- Calcula score de qualificação (0-100)
- **Se score >= 60**: Muda para `PROSPECT`
- **Se score < 60**: Mantém em `SUSPECT` ou move para `DESCARTADO`

**Passo 4: Negociação (PROSPECT)**
- Follow-ups regulares (todas registradas em notes)
- Envio de proposta comercial
- Tratamento de objeções
- Negociação de valores
- Agendamento de reuniões

**Passo 5: Conversão (PROSPECT → CLIENTE)**
- Contrato assinado
- Cria registro na tabela `clients`
- Atualiza lead:
  - `status: 'CLIENTE'`
  - `convertedToClientId: 'uuid-do-cliente'`
  - `convertedAt: Date`
- Nota final registrada
- Transferência para equipe de implementação

---

### Fluxo 2: Lead Manual (Operador)

**Passo 1: Cadastro Manual**
- COADMIN/OPERATOR acessa "Cadastrar Lead Manualmente"
- Preenche formulário:
  - **Obrigatórios**: Nome, Email, Telefone, Cidade, Estado
  - **Origem**: Seleciona dropdown (Lista, Indicação, Evento, Cold Call, Outro)
  - **Detalhes da Origem**: Campo de texto livre (ex: "Lista Solar Magazine Dezembro 2025")
  - **Mensagem Inicial** (opcional): Contexto do lead
- Sistema cria registro:
  - `source: selecionado pelo operador`
  - `sourceDetails: texto informado`
  - `status: 'LEAD'`
  - `createdBy: usuario-logado`
- **Diferença**: Não envia email automático (lead não solicitou contato)

**Passo 2: Triagem Imediata**
- Como o operador já conhece o lead, pode fazer triagem imediata
- **Opção A**: Salvar como `LEAD` e triar depois (padrão)
- **Opção B**: Já salvar como `SUSPECT` se tiver certeza do fit
- Adiciona nota inicial com contexto:
  ```
  [CADASTRO MANUAL] Lead adicionado manualmente

  Origem: Lista Solar Magazine Dezembro 2025
  Contexto: Cliente demonstrou interesse em evento
  Fit Inicial: Residencial, São Paulo, conta ~R$ 400/mês

  Próxima Ação:
  - O quê: Primeiro contato telefônico
  - Quando: 06/01/2026
  - Quem: João Silva
  ```

**Passos 3-5**: Idênticos ao Fluxo 1 (Qualificação → Negociação → Conversão)

---

## 📋 Interfaces do Sistema

### Dashboard de Leads

**Visão Geral (Cards KPI)**:
```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   LEADS     │  SUSPECTS   │  PROSPECTS  │  CLIENTES   │ DESCARTADOS │
│     45      │     28      │     12      │      8      │     15      │
│   (+5 hoje) │  (+3 hoje)  │  (+1 hoje)  │  (+2 hoje)  │  (+1 hoje)  │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

**Filtros**:
- Status (LEAD, SUSPECT, PROSPECT, CLIENTE, DESCARTADO)
- Origem (Landing Page, Manual, Indicação, etc.)
- Vendedor responsável
- Período de criação
- Score (0-20, 21-40, 41-60, 61-80, 81-100)
- Próxima ação (hoje, atrasado, esta semana, este mês)

**Tabela de Leads**:
| Data | Nome | Email | Cidade/UF | Origem | Status | Score | Responsável | Próxima Ação | Ações |
|------|------|-------|-----------|--------|--------|-------|-------------|--------------|-------|
| 03/01 10:30 | João Silva | joao@email.com | SP/SP | Landing Page | SUSPECT | 75 | Maria Santos | 04/01 - Ligar | 👁️ ✏️ |
| 03/01 09:15 | Ana Costa | ana@email.com | RJ/RJ | Lista XYZ | LEAD | 0 | - | - | 👁️ ✏️ |

**Ações Rápidas**:
- 👁️ Visualizar detalhes completos
- ✏️ Editar / Adicionar nota / Mudar status
- 🗑️ Descartar (mover para DESCARTADO)
- 👤 Atribuir vendedor
- 📅 Agendar próxima ação
- ⭐ Atualizar score

---

### Formulário de Cadastro Manual de Lead

```
┌────────────────────────────────────────────────────────────┐
│         Cadastrar Lead Manualmente                          │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  Origem do Lead *                                            │
│  [Dropdown: Landing Page, Lista, Indicação, Evento, ...]    │
│                                                              │
│  Detalhes da Origem                                          │
│  [Input: Ex: "Lista Solar Magazine Dezembro 2025"]          │
│                                                              │
│  ──────────────── Dados Básicos ────────────────             │
│                                                              │
│  Nome Completo *                                             │
│  [Input: João da Silva]                                     │
│                                                              │
│  Email *                                                     │
│  [Input: joao@email.com]                                    │
│                                                              │
│  Telefone *                                                  │
│  [Input: (11) 98765-4321]                                   │
│                                                              │
│  Cidade *                    Estado *                        │
│  [Input: São Paulo]          [Select: SP]                   │
│                                                              │
│  ──────────────── Dados Adicionais ──────────────            │
│                                                              │
│  CEP                                                         │
│  [Input: 01310-100]                                         │
│                                                              │
│  Endereço                                                    │
│  [Input: Av. Paulista]                                      │
│                                                              │
│  Número          Complemento                                 │
│  [Input: 1000]   [Input: Apto 12]                           │
│                                                              │
│  Bairro                                                      │
│  [Input: Bela Vista]                                        │
│                                                              │
│  ──────────────── Contexto Inicial ──────────────            │
│                                                              │
│  Mensagem/Observações Iniciais                               │
│  [Textarea: Cliente conheceu a empresa em evento...]         │
│                                                              │
│  Status Inicial                                              │
│  ( ) LEAD - Sem triagem (padrão)                            │
│  ( ) SUSPECT - Já validado como qualificável                │
│                                                              │
│  [Cancelar]                          [Cadastrar Lead]        │
└────────────────────────────────────────────────────────────┘
```

---

### Modal de Edição de Lead

```
┌─────────────────────────────────────────────────────────────┐
│  Editar Lead: João Silva                                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║ Informações Básicas                                   ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│  Nome: João Silva                                            │
│  Email: joao@email.com                                       │
│  Telefone: (11) 98765-4321                                   │
│  Cidade/UF: São Paulo/SP                                     │
│  Origem: Landing Page                                        │
│  Cadastrado em: 03/01/2026 09:00                            │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  Status Atual: SUSPECT                                       │
│                                                               │
│  Atualizar Status *                                          │
│  [Dropdown: LEAD, SUSPECT, PROSPECT, DESCARTADO]            │
│                                                               │
│  Vendedor Responsável                                        │
│  [Dropdown: Selecione vendedor... Maria Santos, João...]    │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║ Qualificação BANT (apenas se PROSPECT)                ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│                                                               │
│  Orçamento Estimado (R$)                                     │
│  [Input: 25000.00]                                           │
│                                                               │
│  Decisor                                                      │
│  [Input: João Silva (proprietário)]                         │
│                                                               │
│  Necessidade                                                  │
│  [Textarea: Reduzir conta de luz em 90%...]                 │
│                                                               │
│  Timeline                                                     │
│  [Input: 30 dias]                                            │
│                                                               │
│  Score de Qualificação (0-100)                               │
│  [Slider: 75] ████████████████░░░░░░░░                       │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  Próxima Ação Agendada                                       │
│  [Date: 04/01/2026] [Time: 14:00]                           │
│  [Input: Ligar para apresentar proposta comercial]          │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  Adicionar Nova Nota                                         │
│  [Textarea: ...]                                             │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║ Notas Anteriores (5)                                  ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│                                                               │
│  [Maria Santos • 03/01/2026 14:30]                          │
│  [FOLLOW-UP] Ligação realizada...                           │
│                                                               │
│  [João Silva • 03/01/2026 10:00]                            │
│  [TRIAGEM] Lead qualificado como SUSPECT...                 │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  [Cancelar]                              [Salvar Alterações] │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Sistema de Scoring (Qualificação)

### Critérios de Pontuação (0-100 pontos)

**Budget (Orçamento) - 30 pontos**:
- 0 pontos: Sem orçamento / Não informado
- 10 pontos: Orçamento muito baixo (< R$ 10k)
- 20 pontos: Orçamento médio (R$ 10k - R$ 30k)
- 30 pontos: Orçamento alto (> R$ 30k)

**Authority (Decisor) - 25 pontos**:
- 0 pontos: Não identificado
- 10 pontos: Influenciador (não decide)
- 15 pontos: Co-decisor (decide junto)
- 25 pontos: Decisor final (decide sozinho)

**Need (Necessidade) - 25 pontos**:
- 0 pontos: Necessidade vaga / "só olhando"
- 10 pontos: Necessidade identificada mas sem urgência
- 20 pontos: Necessidade clara com prazo flexível
- 25 pontos: Necessidade urgente e crítica

**Timeline (Prazo) - 20 pontos**:
- 0 pontos: Sem prazo definido / "talvez no futuro"
- 5 pontos: Mais de 6 meses
- 10 pontos: 3-6 meses
- 15 pontos: 1-3 meses
- 20 pontos: Menos de 1 mês (urgente)

### Classificação por Score

| Score | Classificação | Status Recomendado | Ação |
|-------|---------------|-------------------|------|
| 0-20 | Muito Baixo | DESCARTADO | Descartar ou "nutrir" para futuro |
| 21-40 | Baixo | SUSPECT | Manter em follow-up esporádico |
| 41-60 | Médio | SUSPECT | Follow-up regular, tentar qualificar melhor |
| 61-80 | Alto | PROSPECT | Prioridade alta, negociação ativa |
| 81-100 | Muito Alto | PROSPECT | Máxima prioridade, fechar rápido |

---

## 📈 Métricas e KPIs

### KPIs por Estágio

**LEAD**:
- Total de leads captados (mês/semana/dia)
- Leads por origem (Landing Page vs. Manual)
- Tempo médio até primeira triagem
- Taxa de conversão LEAD → SUSPECT
- Meta: > 50% dos leads viram suspects

**SUSPECT**:
- Total de suspects ativos
- Suspects por vendedor
- Tempo médio em SUSPECT
- Taxa de conversão SUSPECT → PROSPECT
- Meta: > 40% dos suspects viram prospects

**PROSPECT**:
- Total de prospects em negociação
- Score médio dos prospects
- Tempo médio do ciclo de vendas (PROSPECT → CLIENTE)
- Valor médio das propostas
- Taxa de conversão PROSPECT → CLIENTE
- Meta: > 30% dos prospects fecham

**CLIENTE**:
- Clientes convertidos no período
- Valor total de contratos fechados
- Ticket médio por cliente
- Custo de Aquisição de Cliente (CAC)
- Lifetime Value (LTV)

### Relatórios

1. **Funil de Conversão**:
   - Visualização do funil completo
   - Taxa de conversão em cada estágio
   - Onde estão os gargalos

2. **Performance de Vendedores**:
   - Leads atribuídos vs. convertidos
   - Taxa de conversão individual
   - Tempo médio de ciclo
   - Valor total de vendas

3. **Análise de Origem**:
   - Qual origem traz mais leads
   - Qual origem tem melhor taxa de conversão
   - ROI por canal de aquisição

4. **Follow-ups**:
   - Próximas ações agendadas (calendário)
   - Follow-ups atrasados (alerta)
   - Leads sem follow-up há mais de X dias

---

## 🔄 Migração do Sistema Atual

### Situação Atual

Atualmente temos:
- Tabela `contacts` com status: PENDING, READ, SUSPECT, RESOLVED
- Sistema de `contact_notes`
- Captura apenas via landing page

### Plano de Migração

#### Opção 1: Renomear e Expandir (Recomendada)

**Passo 1**: Criar nova migration
```sql
-- Renomear tabela
ALTER TABLE contacts RENAME TO leads;

-- Adicionar novos campos
ALTER TABLE leads ADD COLUMN source VARCHAR(50) DEFAULT 'LANDING_PAGE';
ALTER TABLE leads ADD COLUMN source_details VARCHAR(255);
ALTER TABLE leads ADD COLUMN assigned_to UUID;
ALTER TABLE leads ADD COLUMN next_action_date TIMESTAMP;
ALTER TABLE leads ADD COLUMN next_action_description VARCHAR(255);
ALTER TABLE leads ADD COLUMN budget DECIMAL(10,2);
ALTER TABLE leads ADD COLUMN authority VARCHAR(255);
ALTER TABLE leads ADD COLUMN need TEXT;
ALTER TABLE leads ADD COLUMN timeline VARCHAR(100);
ALTER TABLE leads ADD COLUMN score INT DEFAULT 0;
ALTER TABLE leads ADD COLUMN converted_to_client_id UUID;
ALTER TABLE leads ADD COLUMN converted_at TIMESTAMP;

-- Adicionar FKs
ALTER TABLE leads ADD CONSTRAINT fk_leads_assigned_to
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL;

-- Atualizar enum de status
ALTER TABLE leads DROP CONSTRAINT IF EXISTS contacts_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('LEAD', 'SUSPECT', 'PROSPECT', 'CLIENTE', 'DESCARTADO'));

-- Migrar dados existentes
UPDATE leads SET status = 'LEAD' WHERE status = 'PENDING';
-- SUSPECT permanece SUSPECT
-- READ vira SUSPECT (já foi triado)
UPDATE leads SET status = 'SUSPECT' WHERE status = 'READ';
-- RESOLVED vira DESCARTADO
UPDATE leads SET status = 'DESCARTADO' WHERE status = 'RESOLVED';

-- Renomear tabela de notas
ALTER TABLE contact_notes RENAME TO lead_notes;
ALTER TABLE lead_notes RENAME COLUMN contact_id TO lead_id;
ALTER TABLE lead_notes DROP CONSTRAINT IF EXISTS FK_contact_notes_contact;
ALTER TABLE lead_notes ADD CONSTRAINT FK_lead_notes_lead
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE;
```

**Passo 2**: Atualizar entities no backend
- Renomear `Contact` → `Lead`
- Renomear `ContactNote` → `LeadNote`
- Adicionar novos campos

**Passo 3**: Atualizar services e controllers
- `ContactsService` → `LeadsService`
- `ContactsController` → `LeadsController`
- Adicionar novos endpoints para cadastro manual

**Passo 4**: Atualizar frontend
- Renomear componentes
- Atualizar rotas (`/contacts` → `/leads`)
- Adicionar formulário de cadastro manual
- Atualizar modais de edição

#### Opção 2: Criar Nova Tabela (Mais Seguro)

**Passo 1**: Criar tabela `leads` do zero

**Passo 2**: Migrar dados de `contacts` → `leads`
```sql
INSERT INTO leads (
  id, name, email, phone, cep, street, number, complement,
  neighborhood, city, state, company_id, message, status,
  created_at, source
)
SELECT
  id, name, email, phone, cep, street, number, complement,
  neighborhood, city, state, company_id, message,
  CASE
    WHEN status = 'PENDING' THEN 'LEAD'
    WHEN status = 'READ' THEN 'SUSPECT'
    WHEN status = 'SUSPECT' THEN 'SUSPECT'
    WHEN status = 'RESOLVED' THEN 'DESCARTADO'
  END,
  created_at,
  'LANDING_PAGE'
FROM contacts;
```

**Passo 3**: Manter `contacts` por um período (rollback safety)

**Passo 4**: Após validação, dropar `contacts`

---

## 🚀 Roadmap de Implementação

### Sprint 1: Base do Sistema de Leads ✅
- [x] Tabela `contacts` → `leads` (migration)
- [x] Novos campos (source, assigned_to, next_action_date, etc.)
- [x] Renomear entities (Contact → Lead)
- [x] Atualizar services e controllers
- [x] Migração de dados existentes

### Sprint 2: Cadastro Manual de Leads 🔄
- [ ] Backend: Endpoint POST `/leads/manual`
- [ ] Frontend: Formulário de cadastro manual
- [ ] Validações específicas para lead manual
- [ ] Dropdown de origens (Lista, Indicação, Evento, etc.)
- [ ] Teste completo do fluxo manual

### Sprint 3: Sistema de Qualificação BANT 📋
- [ ] Campos BANT na interface de edição
- [ ] Cálculo automático de score
- [ ] Validação: PROSPECT requer BANT preenchido
- [ ] Dashboard de scores
- [ ] Alertas de leads com alto score

### Sprint 4: Atribuição e Agendamento ⏰
- [ ] Campo "Vendedor Responsável"
- [ ] Campo "Próxima Ação" (data + descrição)
- [ ] Dashboard "Minhas Ações Hoje"
- [ ] Notificações de follow-ups atrasados
- [ ] Filtros por vendedor

### Sprint 5: Analytics e Reporting 📊
- [ ] Dashboard de funil de vendas
- [ ] Gráficos de conversão
- [ ] Relatório de performance por vendedor
- [ ] Análise de origem de leads
- [ ] Exportação de relatórios (CSV/PDF)

### Sprint 6: Gestão de Clientes 🎯
- [ ] Tabela `clients`
- [ ] Conversão automática PROSPECT → Cliente
- [ ] Dashboard de clientes ativos
- [ ] Histórico completo (lead + cliente)
- [ ] Gestão pós-venda

### Sprint 7: Automações 🤖
- [ ] Templates de notas por tipo de interação
- [ ] Agendamento automático de follow-ups
- [ ] Notificações por email
- [ ] Integração com calendário
- [ ] WhatsApp integration

### Sprint 8: CRM Avançado 🚀
- [ ] Pipeline visual (Kanban)
- [ ] Oportunidades (Deals)
- [ ] Previsão de receita
- [ ] Gestão de propostas
- [ ] Assinatura eletrônica

---

## 📝 Exemplo Completo: Jornada de Lead Manual

### Dia 0 - 03/01/2026 10:00
**Ação**: COADMIN Maria recebe lista de 50 contatos de evento

**Sistema**:
```
Maria acessa: Dashboard → Cadastrar Lead Manualmente

Preenche formulário:
- Origem: Evento
- Detalhes: "Expo Solar 2026 - São Paulo"
- Nome: Carlos Eduardo
- Email: carlos@empresa.com
- Telefone: (11) 91234-5678
- Cidade: São Paulo
- Estado: SP
- Mensagem: "Visitou stand e demonstrou interesse em sistema comercial"
- Status Inicial: SUSPECT (Maria já validou fit no evento)

[Salvar]
```

**Resultado**:
- Lead criado com ID: `lead-001`
- `source: 'EVENTO'`
- `sourceDetails: 'Expo Solar 2026 - São Paulo'`
- `status: 'SUSPECT'`
- `createdBy: maria-id`

**Nota automática criada**:
```
[CADASTRO MANUAL] Lead adicionado por Maria Santos

Origem: Evento - Expo Solar 2026 - São Paulo
Contexto: Visitou stand e demonstrou interesse em sistema comercial

Lead criado em: 03/01/2026 10:00
```

---

### Dia 0 - 03/01/2026 14:00
**Ação**: Maria liga para Carlos (primeiro contato)

**Sistema**:
```
Maria acessa lead-001 → Editar

Status: SUSPECT (mantém)
Vendedor Responsável: Maria Santos (atribui para si)
Próxima Ação: 06/01/2026 10:00 - "Enviar proposta por email"

Adiciona nota:
[FOLLOW-UP] 03/01/2026 14:00

Canal: Telefone

Resumo:
- Ligação durou 20 minutos
- Carlos é sócio-diretor de uma metalúrgica (50 funcionários)
- Conta de luz mensal: R$ 12.000
- Quer reduzir custos operacionais
- Telhado industrial adequado
- Decisão conjunta com outro sócio

Status do Prospect:
- Interesse: Muito Alto
- Objeções: Precisa convencer sócio
- Fase: Primeiro contato

BANT (pré-qualificação):
- Budget: R$ 80.000 estimado
- Authority: Co-decisor (com outro sócio)
- Need: Reduzir custos fixos
- Timeline: 60 dias

Próxima Ação:
- O quê: Enviar proposta técnica e financeira
- Quando: 06/01/2026
- Quem: Maria Santos

[Salvar]
```

**Resultado**:
- Lead atualizado
- `assignedTo: maria-id`
- `nextActionDate: 2026-01-06 10:00`
- `nextActionDescription: "Enviar proposta por email"`
- Nova nota criada

---

### Dia 3 - 06/01/2026 10:00
**Ação**: Maria qualifica como PROSPECT (score alto)

**Sistema**:
```
Maria acessa lead-001 → Editar

Status: PROSPECT ✅ (muda de SUSPECT para PROSPECT)

Preenche BANT completo:
- Orçamento: R$ 80.000
- Decisor: Carlos Eduardo + Sócio Pedro
- Necessidade: Reduzir conta de luz em 80% (R$ 10k/mês → R$ 2k/mês)
- Timeline: 60 dias

Score: Sistema calcula automaticamente
- Budget (R$ 80k): 30 pontos ✅
- Authority (co-decisor): 15 pontos ✅
- Need (urgente): 25 pontos ✅
- Timeline (60 dias): 15 pontos ✅
TOTAL: 85 pontos 🎯 (MUITO ALTO)

Adiciona nota:
[QUALIFICAÇÃO BANT] Lead promovido para PROSPECT

Score: 85/100 (Muito Alto) ⭐⭐⭐⭐⭐

Budget: R$ 80.000 confirmado
Authority: Carlos (sócio) + Pedro (sócio co-decisor)
Need: Reduzir R$ 10k/mês para R$ 2k/mês (80%)
Timeline: Decisão em até 60 dias

Proposta enviada por email com:
- Sistema de 50 kWp
- Economia estimada: R$ 9.600/mês
- ROI: 8 meses
- Valor: R$ 75.000 (à vista) ou financiamento

Próxima Ação:
- O quê: Reunião com ambos os sócios
- Quando: 10/01/2026 14:00
- Quem: Maria Santos

[Salvar]
```

**Resultado**:
- `status: 'PROSPECT'` ✅
- `score: 85`
- `budget: 80000`
- `authority: 'Carlos + Pedro'`
- `need: 'Reduzir conta...'`
- `timeline: '60 dias'`
- Nova nota criada
- Lead aparece em "Prospects de Alta Prioridade" no dashboard

---

### Dia 7 - 10/01/2026 14:00
**Ação**: Reunião com ambos os sócios

**Sistema**:
```
[FOLLOW-UP] 10/01/2026 14:00

Canal: Presencial (visita técnica)

Resumo:
- Reunião na metalúrgica com Carlos e Pedro
- Apresentação técnica completa
- Visita ao telhado (700m² disponíveis)
- Ambos os sócios aprovaram tecnicamente
- Solicitaram desconto de 5%
- Prazo de decisão: até 20/01

Status do Prospect:
- Interesse: Muito Alto (aprovação técnica OK)
- Objeções: Preço (querem R$ 71.250)
- Fase: Negociação final

Próxima Ação:
- O quê: Consultar diretoria sobre desconto adicional
- Quando: 11/01/2026
- Quem: Maria Santos
```

---

### Dia 15 - 18/01/2026 11:00
**Ação**: Fechamento

**Sistema**:
```
[CONVERSÃO] Cliente convertido! 🎉

- Contrato assinado em: 18/01/2026
- Valor final: R$ 72.500 (desconto de 3,3%)
- Forma de pagamento: 50% entrada + 50% em 30 dias
- Prazo de instalação: 45 dias
- Sistema: 50 kWp (130 módulos + 3 inversores)

Observações:
- Clientes muito satisfeitos com atendimento
- Indicaram 2 empresas parceiras
- Solicitaram prioridade na instalação

Próxima Ação:
- Criar registro em 'Clientes'
- Transferir para equipe de instalação
- Agendar kick-off para 20/01/2026
```

**Sistema cria Cliente**:
```
Tabela: clients
- leadId: lead-001
- contractNumber: 2026-001
- contractValue: 72500.00
- contractDate: 2026-01-18
- status: ATIVO
- accountManagerId: maria-id

Atualiza Lead:
- status: 'CLIENTE'
- convertedToClientId: cliente-uuid
- convertedAt: 2026-01-18 11:00
```

**Resultado Final**:
- Tempo total: 15 dias (lead manual → cliente)
- Número de interações: 4 follow-ups
- Score final: 85/100
- Taxa de conversão: 100%
- Valor do contrato: R$ 72.500

---

## 🎓 Conclusão

Este sistema completo de CRM permite:

✅ **Captura de leads** por múltiplos canais (landing page + manual)
✅ **Qualificação sistemática** com metodologia BANT e scoring
✅ **Funil completo** de LEAD → SUSPECT → PROSPECT → CLIENTE
✅ **Rastreabilidade total** com notas e histórico completo
✅ **Gestão de follow-ups** com agendamento e alertas
✅ **Analytics e métricas** para otimizar conversão
✅ **Multi-tenant** com controle por empresa
✅ **Auditoria completa** de todas as ações

**Próximos passos imediatos**:
1. Executar migration de `contacts` → `leads`
2. Implementar cadastro manual de leads
3. Adicionar campos BANT e score
4. Criar dashboard de funil

---

**Versão**: 2.0
**Última Atualização**: 03/01/2026
**Autor**: Sistema Solar - Equipe de Produto
