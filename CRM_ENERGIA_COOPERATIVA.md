# CRM - Energia de Cooperativas

## 📋 Modelo de Negócio

### Produto
**Energia Solar de Cooperativas** - O cliente adquire cota de energia gerada por usinas de cooperativas, sem necessidade de investimento em equipamentos.

### Como Funciona
1. Cliente se associa à cooperativa
2. Adquire cota mensal de energia (kWh)
3. Energia é injetada na rede da distribuidora
4. Distribuidora abate o consumo do cliente
5. Cliente paga apenas pela energia consumida (no futuro, quando houver abatimento)

### Diferencial
- ✅ **Sem investimento inicial** (não compra painéis/inversores)
- ✅ **Pagamento futuro** (quando houver abatimento na conta)
- ✅ **Sem obra** (energia vem da cooperativa)
- ✅ **Economia imediata** na conta de luz

---

## 🎯 Funil de Vendas

```
┌─────────────────────────────────────────────────────────────┐
│                   CAPTAÇÃO DE LEADS                          │
├────────────────────┬────────────────────────────────────────┤
│  Landing Page      │  Cadastro Manual                        │
│  (Empresa)         │  - Por OPERATOR da Empresa              │
│                    │  - Por OPERATOR de Partner              │
└────────────────────┴────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │      LEAD       │
                    │  (novo contato) │
                    └─────────────────┘
                              ↓
                    [Triagem + Mapeamento]
                    ✅ Qual distribuidora atende?
                    ✅ Consumo mensal (kWh)?
                              ↓
                    ┌─────────────────┐
                    │    SUSPECT      │
                    │  (qualificado)  │
                    └─────────────────┘
                              ↓
                    [Verificação de Disponibilidade]
                    ✅ Existe cooperativa na distribuidora?
                    ✅ Tem energia disponível?
                              ↓
              ┌─────────────────┴─────────────────┐
              ↓                                   ↓
    ┌──────────────────┐              ┌──────────────────┐
    │    PROSPECT      │              │   SEM COBERTURA  │
    │ (tem disponib.)  │              │ (sem cooperativa)│
    └──────────────────┘              └──────────────────┘
              ↓
    [Negociação]
    - Proposta de cota
    - Assinatura
              ↓
    ┌──────────────────┐
    │     CLIENTE      │
    │   (associado)    │
    └──────────────────┘
```

---

## 🔐 Regras de Acesso e Visibilidade

### Origem do Lead: Landing Page

**Características**:
- `source: 'LANDING_PAGE'`
- `ownerId: null` (pertence à empresa)
- `ownerType: 'EMPRESA'`

**Quem pode tratar**:
- ✅ ADMIN (qualquer um)
- ✅ COADMIN da empresa
- ✅ OPERATOR da empresa

**Quem pode ver**:
- ✅ ADMIN (todos)
- ✅ COADMIN (todos)
- ✅ OPERATOR da empresa (apenas leads da empresa)

---

### Origem do Lead: OPERATOR de Partner

**Características**:
- `source: 'MANUAL'`
- `ownerId: partner-id`
- `ownerType: 'PARTNER'`
- `createdBy: operator-do-partner-id`

**Quem pode tratar**:
- ✅ ADMIN (qualquer um)
- ✅ COADMIN (qualquer um)
- ✅ OPERATOR do **mesmo partner** (apenas)

**Quem pode ver**:
- ✅ ADMIN (todos)
- ✅ COADMIN (todos)
- ✅ OPERATOR do **mesmo partner** (apenas seus leads)
- ❌ OPERATOR de outro partner (não vê)

---

### Origem do Lead: OPERATOR da Empresa

**Características**:
- `source: 'MANUAL'`
- `ownerId: null`
- `ownerType: 'EMPRESA'`
- `createdBy: operator-da-empresa-id`

**Quem pode tratar**:
- ✅ ADMIN (qualquer um)
- ✅ COADMIN da empresa
- ✅ OPERATOR da empresa

**Quem pode ver**:
- ✅ ADMIN (todos)
- ✅ COADMIN (todos)
- ✅ OPERATOR da empresa (apenas leads da empresa)
- ❌ OPERATOR de partner (não vê)

---

## 📊 Estrutura de Dados

### Tabela: `leads`

```typescript
@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ═══════════════════════════════════════════════════════════
  // ORIGEM E PROPRIEDADE
  // ═══════════════════════════════════════════════════════════

  @Column({
    type: 'enum',
    enum: ['LANDING_PAGE', 'MANUAL'],
  })
  source: 'LANDING_PAGE' | 'MANUAL';

  @Column({
    type: 'enum',
    enum: ['EMPRESA', 'PARTNER'],
    name: 'owner_type',
  })
  ownerType: 'EMPRESA' | 'PARTNER';

  // Se ownerType = 'PARTNER', este campo aponta para o partner
  // Se ownerType = 'EMPRESA', este campo é NULL
  @Column({ name: 'owner_id', nullable: true })
  ownerId?: string;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner?: Company; // Partner que "possui" este lead

  // ═══════════════════════════════════════════════════════════
  // DADOS BÁSICOS
  // ═══════════════════════════════════════════════════════════

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
  message?: string;

  // ═══════════════════════════════════════════════════════════
  // STATUS NO FUNIL
  // ═══════════════════════════════════════════════════════════

  @Column({
    type: 'enum',
    enum: ['LEAD', 'SUSPECT', 'PROSPECT', 'CLIENTE', 'SEM_COBERTURA', 'DESCARTADO'],
    default: 'LEAD',
  })
  status: LeadStatus;

  // ═══════════════════════════════════════════════════════════
  // QUALIFICAÇÃO (LEAD → SUSPECT)
  // Obrigatórios para mudar de LEAD → SUSPECT
  // ═══════════════════════════════════════════════════════════

  @Column({ name: 'distributor_id', nullable: true })
  distributorId?: string;

  @ManyToOne(() => Distributor, { nullable: true })
  @JoinColumn({ name: 'distributor_id' })
  distributor?: Distributor;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'monthly_consumption_kwh' })
  monthlyConsumptionKwh?: number; // Consumo mensal em kWh

  // ═══════════════════════════════════════════════════════════
  // VALIDAÇÃO DE DISPONIBILIDADE (SUSPECT → PROSPECT)
  // Sistema verifica automaticamente antes de permitir PROSPECT
  // ═══════════════════════════════════════════════════════════

  @Column({ name: 'cooperative_id', nullable: true })
  cooperativeId?: string;

  @ManyToOne(() => Cooperative, { nullable: true })
  @JoinColumn({ name: 'cooperative_id' })
  cooperative?: Cooperative; // Cooperativa que atenderá (se houver)

  @Column({ type: 'boolean', default: false, name: 'has_availability' })
  hasAvailability: boolean; // TRUE se existe energia disponível

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'available_energy_kwh' })
  availableEnergyKwh?: number; // Energia disponível na cooperativa (snapshot)

  // ═══════════════════════════════════════════════════════════
  // PROPOSTA (quando vira PROSPECT)
  // ═══════════════════════════════════════════════════════════

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'proposed_quota_kwh' })
  proposedQuotaKwh?: number; // Cota proposta (kWh/mês)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'monthly_savings' })
  monthlySavings?: number; // Economia mensal estimada (R$)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'monthly_value' })
  monthlyValue?: number; // Valor mensal a pagar (R$)

  // ═══════════════════════════════════════════════════════════
  // GESTÃO DO FUNIL
  // ═══════════════════════════════════════════════════════════

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedToUser?: User;

  @Column({ name: 'next_action_date', nullable: true })
  nextActionDate?: Date;

  @Column({ name: 'next_action_description', nullable: true })
  nextActionDescription?: string;

  // ═══════════════════════════════════════════════════════════
  // RELACIONAMENTOS
  // ═══════════════════════════════════════════════════════════

  @OneToMany(() => LeadNote, (note) => note.lead)
  notes: LeadNote[];

  // ═══════════════════════════════════════════════════════════
  // AUDITORIA
  // ═══════════════════════════════════════════════════════════

  @Column({ name: 'company_id' })
  companyId: string; // Empresa principal do sistema

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser?: User;

  // ═══════════════════════════════════════════════════════════
  // CONVERSÃO
  // ═══════════════════════════════════════════════════════════

  @Column({ name: 'converted_to_client_id', nullable: true })
  convertedToClientId?: string;

  @Column({ name: 'converted_at', nullable: true })
  convertedAt?: Date;
}
```

---

## 🔄 Fluxos de Trabalho

### Fluxo 1: Lead da Landing Page

**Dia 0 - 09:00**: Lead preenche formulário
```
Sistema cria:
- source: 'LANDING_PAGE'
- ownerType: 'EMPRESA'
- ownerId: null
- status: 'LEAD'
- companyId: empresa-principal-id
- createdBy: null (sistema)
```

**Dia 0 - 10:30**: OPERATOR da empresa visualiza e tria
```
OPERATOR acessa dashboard → Vê o lead
Abre modal de edição:

Status: LEAD → SUSPECT

Mapeamento obrigatório:
- Distribuidora: [Dropdown] → Seleciona "CPFL Paulista"
- Consumo Mensal (kWh): [Input] → "450 kWh"

Nota:
[TRIAGEM] Lead qualificado como SUSPECT

Perfil:
- Residencial em Campinas/SP
- Distribuidora: CPFL Paulista
- Consumo: 450 kWh/mês (~R$ 350/mês)
- Cliente demonstrou grande interesse

Próxima Ação:
- O quê: Verificar disponibilidade de cooperativa
- Quando: 04/01/2026
- Quem: João Silva
```

**Sistema valida**:
```typescript
// Antes de permitir SUSPECT, valida:
if (!lead.distributorId) {
  throw new BadRequestException('Distribuidora é obrigatória para status SUSPECT');
}
if (!lead.monthlyConsumptionKwh || lead.monthlyConsumptionKwh <= 0) {
  throw new BadRequestException('Consumo mensal (kWh) é obrigatório para status SUSPECT');
}

// Atualiza lead
lead.status = 'SUSPECT';
lead.distributorId = 'cpfl-paulista-id';
lead.monthlyConsumptionKwh = 450;
```

---

**Dia 3 - 06/01**: COADMIN verifica disponibilidade

```
COADMIN acessa lead → Editar

Status: SUSPECT → PROSPECT

Sistema AUTOMATICAMENTE verifica:
1. Busca cooperativas que atendem CPFL Paulista:
   SELECT * FROM cooperatives
   WHERE distributor_id = 'cpfl-paulista-id'
   AND available_energy > 0

2. Se encontrar cooperativa:
   - hasAvailability = true
   - cooperativeId = cooperativa-id
   - availableEnergyKwh = cooperative.available_energy (snapshot)
   - Permite status PROSPECT ✅

3. Se NÃO encontrar:
   - hasAvailability = false
   - Bloqueia status PROSPECT ❌
   - Sugere status SEM_COBERTURA

COADMIN preenche proposta:
- Cota Proposta: 400 kWh/mês (88% do consumo)
- Valor Mensal: R$ 280/mês
- Economia Mensal: R$ 70/mês (20%)

Nota:
[QUALIFICAÇÃO] Lead promovido para PROSPECT

Disponibilidade confirmada:
✅ Cooperativa: Cooperativa Solar Campinas
✅ Energia disponível: 15.000 kWh/mês
✅ Distribuidora: CPFL Paulista

Proposta:
- Cota: 400 kWh/mês
- Valor: R$ 280/mês
- Economia: R$ 70/mês (20%)
- Cobertura: 88% do consumo

Próxima Ação:
- O quê: Enviar proposta por email
- Quando: 07/01/2026
- Quem: Maria Santos
```

**Sistema atualiza**:
```typescript
// Valida disponibilidade
const cooperative = await this.cooperativeService.findAvailable(lead.distributorId);

if (!cooperative || cooperative.available_energy <= 0) {
  throw new BadRequestException(
    'Não há cooperativa com energia disponível para esta distribuidora. ' +
    'Mova o lead para status SEM_COBERTURA.'
  );
}

// Atualiza lead
lead.status = 'PROSPECT';
lead.cooperativeId = cooperative.id;
lead.hasAvailability = true;
lead.availableEnergyKwh = cooperative.available_energy;
lead.proposedQuotaKwh = 400;
lead.monthlyValue = 280;
lead.monthlySavings = 70;
```

---

### Fluxo 2: Lead Manual de OPERATOR de Partner

**Dia 0 - 11:00**: OPERATOR do Partner "SolarVendas" cadastra lead

```
OPERATOR logado (parceiro SolarVendas):
- companyId: solarvendas-partner-id
- role: OPERATOR

Dashboard → Cadastrar Lead Manualmente

Formulário:
- Nome: Ana Paula
- Email: ana@email.com
- Telefone: (19) 98888-7777
- Cidade: Campinas
- Estado: SP
- Mensagem: "Indicação de cliente atual"

[Salvar]
```

**Sistema cria automaticamente**:
```typescript
const lead = {
  source: 'MANUAL',
  ownerType: 'PARTNER', // ← Detecta que criador é OPERATOR de partner
  ownerId: currentUser.companyId, // ← Partner do OPERATOR
  companyId: mainCompanyId, // Empresa principal do sistema
  status: 'LEAD',
  createdBy: currentUser.id,
  // ... dados do formulário
};
```

**Resultado**:
- Lead pertence ao Partner "SolarVendas"
- Apenas OPERATORS deste partner podem ver/editar
- COADMIN/ADMIN veem todos

---

**Dia 1 - 12:00**: OPERATOR do mesmo partner tria

```
OPERATOR do SolarVendas acessa dashboard:
- Vê apenas leads do partner SolarVendas ✅
- NÃO vê leads da empresa ❌
- NÃO vê leads de outros partners ❌

Edita lead Ana Paula:
Status: LEAD → SUSPECT

Distribuidora: Energisa Sul-Sudeste
Consumo: 800 kWh/mês

[Salvar]
```

**Sistema valida**:
```typescript
// Verifica se OPERATOR pode editar este lead
if (lead.ownerType === 'PARTNER' && lead.ownerId !== currentUser.companyId) {
  throw new ForbiddenException('Você só pode editar leads do seu partner');
}

// Atualiza
lead.status = 'SUSPECT';
lead.distributorId = 'energisa-id';
lead.monthlyConsumptionKwh = 800;
```

---

**Dia 5 - 15/01**: COADMIN promove para PROSPECT

```
COADMIN (vê todos os leads):
- Vê leads da empresa ✅
- Vê leads de todos os partners ✅

Acessa lead Ana Paula (do partner SolarVendas)
Status: SUSPECT → PROSPECT

Sistema verifica disponibilidade:
❌ Não há cooperativa com energia disponível na Energisa

COADMIN muda status: SEM_COBERTURA

Nota:
[SEM COBERTURA] Infelizmente não temos cobertura

Distribuidora: Energisa Sul-Sudeste
Cooperativas consultadas: 3
Energia disponível: 0 kWh

Recomendação: Adicionar na lista de espera para quando houver expansão
```

---

### Fluxo 3: Lead Manual de OPERATOR da Empresa

**Dia 0 - 14:00**: OPERATOR da empresa cadastra lead

```
OPERATOR logado (empresa principal):
- companyId: empresa-principal-id
- role: OPERATOR

Dashboard → Cadastrar Lead Manualmente

Formulário:
- Nome: Roberto Costa
- Email: roberto@email.com
- Telefone: (11) 97777-6666
- Cidade: São Paulo
- Estado: SP
- Mensagem: "Cliente de cold call"

[Salvar]
```

**Sistema cria**:
```typescript
const lead = {
  source: 'MANUAL',
  ownerType: 'EMPRESA', // ← OPERATOR é da empresa
  ownerId: null, // ← Empresa não precisa de ownerId
  companyId: mainCompanyId,
  status: 'LEAD',
  createdBy: currentUser.id,
  // ... dados
};
```

**Resultado**:
- Lead pertence à empresa
- COADMIN e OPERATORS da empresa podem ver/editar
- OPERATORS de partners NÃO veem ❌

---

## 🛡️ Implementação de Segurança (Backend)

### Service: LeadsService

```typescript
@Injectable()
export class LeadsService {
  // ═══════════════════════════════════════════════════════════
  // FILTRAR LEADS POR PERMISSÃO
  // ═══════════════════════════════════════════════════════════

  async findAll(currentUser: any): Promise<Lead[]> {
    const query = this.leadsRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.distributor', 'distributor')
      .leftJoinAndSelect('lead.cooperative', 'cooperative')
      .leftJoinAndSelect('lead.assignedToUser', 'assignedToUser')
      .leftJoinAndSelect('lead.notes', 'notes')
      .leftJoinAndSelect('notes.createdByUser', 'noteCreator');

    // ADMIN e COADMIN veem TODOS os leads
    if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.COADMIN) {
      return query.getMany();
    }

    // OPERATOR vê apenas:
    // 1. Leads da EMPRESA (ownerType = 'EMPRESA')
    // 2. Leads do SEU PARTNER (ownerType = 'PARTNER' AND ownerId = seu companyId)

    query.andWhere(
      new Brackets((qb) => {
        // Leads da empresa
        qb.where("lead.ownerType = :ownerTypeEmpresa", { ownerTypeEmpresa: 'EMPRESA' })
          // OU leads do seu partner
          .orWhere(
            new Brackets((qb2) => {
              qb2.where("lead.ownerType = :ownerTypePartner", { ownerTypePartner: 'PARTNER' })
                .andWhere("lead.ownerId = :partnerId", { partnerId: currentUser.companyId });
            })
          );
      })
    );

    return query.getMany();
  }

  // ═══════════════════════════════════════════════════════════
  // VALIDAR PERMISSÃO DE EDIÇÃO
  // ═══════════════════════════════════════════════════════════

  async update(id: string, updateDto: UpdateLeadDto, currentUser: any): Promise<Lead> {
    const lead = await this.findOne(id);

    if (!lead) {
      throw new NotFoundException(`Lead com ID ${id} não encontrado`);
    }

    // ADMIN e COADMIN podem editar qualquer lead
    if (currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.COADMIN) {
      return this.performUpdate(lead, updateDto, currentUser);
    }

    // OPERATOR só pode editar:
    // 1. Leads da EMPRESA (se for OPERATOR da empresa)
    // 2. Leads do SEU PARTNER (se for OPERATOR de partner)

    const canEdit =
      (lead.ownerType === 'EMPRESA') || // Lead da empresa
      (lead.ownerType === 'PARTNER' && lead.ownerId === currentUser.companyId); // Lead do seu partner

    if (!canEdit) {
      throw new ForbiddenException('Você não tem permissão para editar este lead');
    }

    return this.performUpdate(lead, updateDto, currentUser);
  }

  // ═══════════════════════════════════════════════════════════
  // ATUALIZAR STATUS: LEAD → SUSPECT
  // ═══════════════════════════════════════════════════════════

  private async performUpdate(lead: Lead, updateDto: UpdateLeadDto, currentUser: any): Promise<Lead> {
    // Se mudando para SUSPECT, validar campos obrigatórios
    if (updateDto.status === 'SUSPECT') {
      if (!updateDto.distributorId) {
        throw new BadRequestException('Distribuidora é obrigatória para status SUSPECT');
      }
      if (!updateDto.monthlyConsumptionKwh || updateDto.monthlyConsumptionKwh <= 0) {
        throw new BadRequestException('Consumo mensal (kWh) é obrigatório e deve ser maior que zero');
      }

      lead.distributorId = updateDto.distributorId;
      lead.monthlyConsumptionKwh = updateDto.monthlyConsumptionKwh;
    }

    // ═══════════════════════════════════════════════════════════
    // ATUALIZAR STATUS: SUSPECT → PROSPECT
    // ═══════════════════════════════════════════════════════════

    if (updateDto.status === 'PROSPECT') {
      // Validar que é SUSPECT atualmente
      if (lead.status !== 'SUSPECT') {
        throw new BadRequestException('Apenas leads com status SUSPECT podem virar PROSPECT');
      }

      // Validar que distribuidora está definida
      if (!lead.distributorId) {
        throw new BadRequestException('Distribuidora deve estar definida antes de virar PROSPECT');
      }

      // Buscar cooperativa com disponibilidade
      const cooperative = await this.cooperativeService.findAvailableByDistributor(lead.distributorId);

      if (!cooperative || cooperative.availableEnergy <= 0) {
        throw new BadRequestException(
          `Não há cooperativa com energia disponível para a distribuidora ${lead.distributor?.name || 'selecionada'}. ` +
          `Mova o lead para status SEM_COBERTURA.`
        );
      }

      // Atualizar lead com dados da cooperativa
      lead.cooperativeId = cooperative.id;
      lead.hasAvailability = true;
      lead.availableEnergyKwh = cooperative.availableEnergy;

      // Se proposta foi informada, atualizar
      if (updateDto.proposedQuotaKwh) {
        lead.proposedQuotaKwh = updateDto.proposedQuotaKwh;
      }
      if (updateDto.monthlyValue) {
        lead.monthlyValue = updateDto.monthlyValue;
      }
      if (updateDto.monthlySavings) {
        lead.monthlySavings = updateDto.monthlySavings;
      }
    }

    // Atualizar status
    if (updateDto.status) {
      lead.status = updateDto.status;
    }

    // Atualizar outros campos
    if (updateDto.assignedTo) {
      lead.assignedTo = updateDto.assignedTo;
    }
    if (updateDto.nextActionDate) {
      lead.nextActionDate = updateDto.nextActionDate;
    }
    if (updateDto.nextActionDescription) {
      lead.nextActionDescription = updateDto.nextActionDescription;
    }

    // Salvar
    await this.leadsRepository.save(lead);

    // Adicionar nota se fornecida
    if (updateDto.note) {
      const note = this.leadNoteRepository.create({
        leadId: lead.id,
        note: updateDto.note,
        createdBy: currentUser.id,
      });
      await this.leadNoteRepository.save(note);
    }

    // Retornar lead atualizado
    return this.findOne(lead.id);
  }

  // ═══════════════════════════════════════════════════════════
  // CRIAR LEAD MANUAL
  // ═══════════════════════════════════════════════════════════

  async createManual(createDto: CreateLeadManualDto, currentUser: any): Promise<Lead> {
    // Determinar ownerType e ownerId baseado no criador
    let ownerType: 'EMPRESA' | 'PARTNER';
    let ownerId: string | null;

    // Se o usuário pertence a um partner, o lead é do partner
    const userCompany = await this.companyService.findOne(currentUser.companyId);

    if (userCompany.isPartner) {
      ownerType = 'PARTNER';
      ownerId = currentUser.companyId;
    } else {
      ownerType = 'EMPRESA';
      ownerId = null;
    }

    const lead = this.leadsRepository.create({
      ...createDto,
      source: 'MANUAL',
      ownerType,
      ownerId,
      companyId: this.getMainCompanyId(), // Empresa principal do sistema
      status: 'LEAD',
      createdBy: currentUser.id,
    });

    const savedLead = await this.leadsRepository.save(lead);

    // Criar nota automática
    const note = this.leadNoteRepository.create({
      leadId: savedLead.id,
      note: `[CADASTRO MANUAL] Lead adicionado por ${currentUser.name}\n\nOrigem: Cadastro manual\nTipo: ${ownerType}`,
      createdBy: currentUser.id,
    });
    await this.leadNoteRepository.save(note);

    return this.findOne(savedLead.id);
  }
}
```

---

## 📋 Interface do Sistema

### Dashboard de Leads (com filtro por visibilidade)

**Para COADMIN/ADMIN**:
```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard de Leads                          [+ Novo Lead]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐ │
│  │   LEADS     │  SUSPECTS   │  PROSPECTS  │  CLIENTES   │ │
│  │     45      │     28      │     12      │      8      │ │
│  │ Empresa: 30 │ Empresa: 18 │ Empresa: 8  │ Empresa: 5  │ │
│  │ Partners:15 │ Partners:10 │ Partners: 4 │ Partners: 3 │ │
│  └─────────────┴─────────────┴─────────────┴─────────────┘ │
│                                                               │
│  Filtros:                                                     │
│  [Status ▼] [Origem ▼] [Proprietário ▼] [Vendedor ▼]        │
│                                                               │
│  Proprietário:                                                │
│  ( ) Todos                                                    │
│  ( ) Empresa                                                  │
│  ( ) Partners                                                 │
│  ( ) Partner: SolarVendas                                    │
│  ( ) Partner: EnergiaPro                                     │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Nome      Email         Origem    Proprietário Status │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ João Silva joao@...    Landing   EMPRESA      SUSPECT│  │
│  │ Ana Costa  ana@...     Manual    SolarVendas  LEAD   │  │
│  │ Carlos Ed  carlos@...  Manual    EMPRESA      PROSPECT│ │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Para OPERATOR da Empresa**:
```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard de Leads                          [+ Novo Lead]   │
├─────────────────────────────────────────────────────────────┤
│  ✅ Você vê: Leads da EMPRESA                                │
│  ❌ Você NÃO vê: Leads de Partners                           │
│                                                               │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐ │
│  │   LEADS     │  SUSPECTS   │  PROSPECTS  │  CLIENTES   │ │
│  │     30      │     18      │      8      │      5      │ │
│  └─────────────┴─────────────┴─────────────┴─────────────┘ │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Nome      Email         Origem    Status             │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ João Silva joao@...    Landing   SUSPECT             │  │
│  │ Carlos Ed  carlos@...  Manual    PROSPECT            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Para OPERATOR de Partner (ex: SolarVendas)**:
```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard de Leads - SolarVendas            [+ Novo Lead]   │
├─────────────────────────────────────────────────────────────┤
│  ✅ Você vê: Leads do SEU PARTNER (SolarVendas)              │
│  ❌ Você NÃO vê: Leads da Empresa                            │
│  ❌ Você NÃO vê: Leads de outros Partners                    │
│                                                               │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐ │
│  │   LEADS     │  SUSPECTS   │  PROSPECTS  │  CLIENTES   │ │
│  │     15      │     10      │      4      │      3      │ │
│  └─────────────┴─────────────┴─────────────┴─────────────┘ │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Nome      Email         Origem    Status             │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ Ana Costa  ana@...     Manual    LEAD                │  │
│  │ Maria S    maria@...   Manual    SUSPECT             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Modal de Edição: LEAD → SUSPECT

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
│  Telefone: (19) 98765-4321                                   │
│  Cidade/UF: Campinas/SP                                      │
│  Origem: Landing Page                                        │
│  Proprietário: EMPRESA                                       │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  Status Atual: LEAD                                          │
│                                                               │
│  Atualizar Status *                                          │
│  [Dropdown: LEAD, SUSPECT, DESCARTADO]                      │
│                                                               │
│  ⚠️ Para mudar para SUSPECT, preencha os campos abaixo:     │
│                                                               │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║ Mapeamento (Obrigatório para SUSPECT)                 ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│                                                               │
│  Distribuidora *                                             │
│  [Dropdown: Selecione...]                                   │
│  ├─ CPFL Paulista                                           │
│  ├─ Energisa Sul-Sudeste                                    │
│  ├─ EDP São Paulo                                           │
│  └─ Enel São Paulo                                          │
│                                                               │
│  Consumo Mensal (kWh) *                                      │
│  [Input: 450] kWh/mês                                        │
│                                                               │
│  💡 Dica: Consultar conta de luz do cliente                  │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  Adicionar Nota                                              │
│  [Textarea: Lead qualificado...]                            │
│                                                               │
│  [Cancelar]                              [Salvar Alterações] │
└─────────────────────────────────────────────────────────────┘
```

---

### Modal de Edição: SUSPECT → PROSPECT

```
┌─────────────────────────────────────────────────────────────┐
│  Editar Lead: João Silva                                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Status Atual: SUSPECT                                       │
│                                                               │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║ Dados de Qualificação                                  ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│  Distribuidora: CPFL Paulista ✅                             │
│  Consumo: 450 kWh/mês ✅                                     │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  Atualizar Status                                            │
│  [Dropdown: SUSPECT, PROSPECT, SEM_COBERTURA, DESCARTADO]   │
│                                                               │
│  ⚠️ Ao selecionar PROSPECT, o sistema verifica:             │
│  ✅ Existe cooperativa para CPFL Paulista?                   │
│  ✅ Tem energia disponível?                                  │
│                                                               │
│  [Verificar Disponibilidade Agora]                           │
│                                                               │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║ Resultado da Verificação                               ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│  ✅ Cooperativa encontrada!                                  │
│  📍 Cooperativa Solar Campinas                               │
│  ⚡ Energia disponível: 15.000 kWh/mês                       │
│  📊 Atende distribuidora: CPFL Paulista                      │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║ Proposta (Preencher se PROSPECT)                       ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│                                                               │
│  Cota Proposta (kWh/mês)                                     │
│  [Input: 400] kWh/mês                                        │
│  (88% do consumo total)                                      │
│                                                               │
│  Valor Mensal (R$)                                           │
│  [Input: 280.00] R$/mês                                      │
│                                                               │
│  Economia Mensal Estimada (R$)                               │
│  [Input: 70.00] R$/mês                                       │
│  (20% de economia)                                           │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  Adicionar Nota                                              │
│  [Textarea: Lead promovido para PROSPECT...]                │
│                                                               │
│  [Cancelar]                              [Salvar Alterações] │
└─────────────────────────────────────────────────────────────┘
```

---

### Caso SEM COBERTURA

```
┌─────────────────────────────────────────────────────────────┐
│  Editar Lead: Ana Costa                                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Status Atual: SUSPECT                                       │
│                                                               │
│  Distribuidora: Energisa Sul-Sudeste ✅                      │
│  Consumo: 800 kWh/mês ✅                                     │
│                                                               │
│  [Verificar Disponibilidade Agora]                           │
│                                                               │
│  ╔═══════════════════════════════════════════════════════╗  │
│  ║ Resultado da Verificação                               ║  │
│  ╚═══════════════════════════════════════════════════════╝  │
│  ❌ Sem cobertura                                            │
│  📍 Não há cooperativa com energia disponível                │
│  📊 Distribuidora: Energisa Sul-Sudeste                      │
│  ⚠️  Cooperativas consultadas: 3                             │
│  ⚠️  Energia disponível: 0 kWh                               │
│                                                               │
│  💡 Recomendação:                                            │
│  - Mude status para SEM_COBERTURA                            │
│  - Adicione lead na lista de espera                          │
│  - Notifique quando houver expansão                          │
│                                                               │
│  ─────────────────────────────────────────────────────────   │
│                                                               │
│  Atualizar Status                                            │
│  [Dropdown: SEM_COBERTURA (recomendado)]                    │
│                                                               │
│  [Cancelar]                              [Salvar Alterações] │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Roadmap de Implementação

### Sprint 1: Migração Base ✅ (Atual)
- [ ] Migration: Renomear `contacts` → `leads`
- [ ] Adicionar campos: `ownerType`, `ownerId`, `source`
- [ ] Adicionar campos de qualificação: `distributorId`, `monthlyConsumptionKwh`
- [ ] Adicionar campos de disponibilidade: `cooperativeId`, `hasAvailability`
- [ ] Migrar dados existentes

### Sprint 2: Regras de Acesso 🔐
- [ ] Implementar filtros por `ownerType` e `ownerId`
- [ ] Service: `findAll()` com filtro por permissão
- [ ] Guard: validar edição por permissão
- [ ] Testes de permissão

### Sprint 3: Cadastro Manual 📝
- [ ] Backend: Endpoint `POST /leads/manual`
- [ ] Frontend: Formulário de cadastro manual
- [ ] Detectar `ownerType` automaticamente
- [ ] Criar nota automática de cadastro

### Sprint 4: Qualificação (LEAD → SUSPECT) 📊
- [ ] Backend: Validação de campos obrigatórios
- [ ] Frontend: Campos de distribuidora e consumo
- [ ] Dropdown de distribuidoras
- [ ] Validação no submit

### Sprint 5: Disponibilidade (SUSPECT → PROSPECT) ⚡
- [ ] Backend: Verificação automática de cooperativa
- [ ] Service: `findAvailableByDistributor()`
- [ ] Frontend: Botão "Verificar Disponibilidade"
- [ ] Feedback visual (✅ tem / ❌ sem cobertura)

### Sprint 6: Proposta e Conversão 💰
- [ ] Campos de proposta: `proposedQuotaKwh`, `monthlyValue`, `monthlySavings`
- [ ] Frontend: Formulário de proposta
- [ ] Cálculo automático de economia
- [ ] Conversão PROSPECT → CLIENTE

### Sprint 7: Dashboard e Analytics 📈
- [ ] Dashboard separado por proprietário
- [ ] Filtros avançados
- [ ] KPIs por empresa/partner
- [ ] Relatórios de conversão

### Sprint 8: Automações 🤖
- [ ] Notificação quando cooperativa tiver energia disponível
- [ ] Lista de espera para SEM_COBERTURA
- [ ] Follow-ups automáticos
- [ ] Integração com cooperativas (API)

---

## 📝 Resumo das Regras

### ✅ Permissões de Visualização

| Perfil | Leads Empresa | Leads Partners | Leads Específico |
|--------|---------------|----------------|------------------|
| ADMIN | ✅ Todos | ✅ Todos | ✅ Todos |
| COADMIN | ✅ Todos | ✅ Todos | ✅ Todos |
| OPERATOR (Empresa) | ✅ Sim | ❌ Não | ❌ Não |
| OPERATOR (Partner X) | ❌ Não | ✅ Apenas Partner X | ❌ Não |

### ✅ Campos Obrigatórios por Status

**LEAD → SUSPECT**:
- ✅ `distributorId` (qual distribuidora atende)
- ✅ `monthlyConsumptionKwh` (consumo em kWh/mês)

**SUSPECT → PROSPECT**:
- ✅ Sistema verifica automaticamente disponibilidade
- ✅ Bloqueia se não houver cooperativa disponível
- ✅ Sugere status `SEM_COBERTURA` se não houver

**PROSPECT → CLIENTE**:
- ✅ Proposta aceita
- ✅ Contrato assinado

---

**Versão**: 3.0 - Energia de Cooperativas
**Última Atualização**: 03/01/2026
**Modelo**: Multi-tenant com Partners
