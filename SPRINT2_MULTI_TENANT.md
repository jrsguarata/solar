# Sprint 2 - Regras de Acesso Multi-tenant

## 🎯 Objetivo

Implementar controle de acesso multi-tenant para leads, garantindo que cada tipo de usuário (ADMIN, COADMIN, OPERATOR) veja apenas os leads apropriados baseado em sua empresa e perfil.

## 📋 Regras de Negócio

### Ownership de Leads

Cada lead possui:
- **source**: Como o lead foi criado
  - `LANDING_PAGE`: Formulário público da landing page
  - `MANUAL`: Cadastro manual por operator/coadmin

- **ownerType**: Quem "possui" o lead
  - `EMPRESA`: Pertence à empresa principal
  - `PARTNER`: Pertence a um partner específico

- **ownerId**: ID da empresa partner (se ownerType = PARTNER)

### Regras de Acesso por Perfil

#### 1. ADMIN (Administrador do Sistema)
- ✅ **Acesso Total**: Vê todos os leads de todas as empresas e partners
- ✅ Não precisa estar vinculado a uma empresa
- ✅ Bypassa todas as validações de acesso

#### 2. COADMIN da EMPRESA (Administrador da Empresa Principal)
- ✅ **Vê TODOS os leads**: Tanto da empresa quanto de todos os partners
- ✅ Pode gerenciar qualquer lead (empresa + partners)
- ✅ Pode criar leads manuais (ficam como ownerType=EMPRESA)

#### 3. COADMIN de PARTNER (Administrador de Partner)
- ⚠️ **Vê APENAS leads do seu partner**: ownerType=PARTNER && ownerId=companyId
- ⚠️ Não vê leads da empresa nem de outros partners
- ⚠️ Pode criar leads manuais (ficam como ownerType=PARTNER, ownerId=companyId)

#### 4. OPERATOR da EMPRESA (Operador da Empresa)
- ⚠️ **Vê APENAS leads da empresa**: ownerType=EMPRESA
- ⚠️ Não vê leads de partners
- ⚠️ Pode criar leads manuais (ficam como ownerType=EMPRESA)

#### 5. OPERATOR de PARTNER (Operador de Partner)
- ⚠️ **Vê APENAS leads do seu partner**: ownerType=PARTNER && ownerId=companyId
- ⚠️ Não vê leads da empresa nem de outros partners
- ⚠️ Pode criar leads manuais (ficam como ownerType=PARTNER, ownerId=companyId)

## 🔒 Implementação

### 1. Guard - CompanyAccessGuard

**Arquivo**: `backend/src/common/guards/company-access.guard.ts`

**Função**:
- Valida se usuário está autenticado
- ADMIN bypassa validações
- Outros perfis devem ter `companyId`
- Anexa `accessControl` ao request com informações do usuário

**AccessControl**:
```typescript
{
  userId: string;
  role: UserRole;
  companyId: string;
  isPartner: boolean;
}
```

### 2. Service - ContactsService

**Métodos Atualizados**:

#### `findAll(accessControl?: AccessControl): Promise<Lead[]>`
- ADMIN: Retorna todos os leads
- COADMIN empresa: Retorna empresa + partners
- COADMIN partner: Retorna apenas do partner
- OPERATOR empresa: Retorna apenas empresa
- OPERATOR partner: Retorna apenas do partner

#### `findOne(id, accessControl?: AccessControl): Promise<Lead>`
- Busca o lead
- Valida acesso usando `validateAccess()`
- Lança `ForbiddenException` se sem permissão

#### `createManual(dto, accessControl): Promise<Lead>`
- Cria lead com `source=MANUAL`
- Define `ownerType` e `ownerId` baseado no usuário:
  - EMPRESA operator/coadmin → ownerType=EMPRESA, ownerId=undefined
  - PARTNER operator/coadmin → ownerType=PARTNER, ownerId=companyId

**Método Privado**:
- `buildWhereClause(accessControl)`: Constrói filtros TypeORM
- `validateAccess(lead, accessControl)`: Valida se usuário pode acessar lead

### 3. Controller - ContactsController

**Endpoints Atualizados**:

#### `POST /leads` (Público)
- Cria lead da landing page
- `source=LANDING_PAGE`
- `ownerType=EMPRESA` (default)

#### `POST /leads/manual` (Autenticado)
- ✅ Roles: ADMIN, COADMIN, OPERATOR
- ✅ Guard: CompanyAccessGuard
- Cria lead manual com ownership baseado no usuário
- Usa `req.accessControl` para determinar ownership

#### `GET /leads` (Autenticado)
- ✅ Roles: ADMIN, COADMIN, OPERATOR
- ✅ Guard: CompanyAccessGuard
- Retorna leads filtrados por acesso
- Usa `req.accessControl` para filtrar

#### `GET /leads/:id` (Autenticado)
- ✅ Roles: ADMIN, COADMIN, OPERATOR
- ✅ Guard: CompanyAccessGuard
- Valida acesso ao lead específico
- Retorna 403 se sem permissão

## 📊 Exemplos de Uso

### Cenário 1: COADMIN da Empresa

```typescript
// Usuário: coadmin@empresa.com
// Role: COADMIN
// CompanyId: uuid-empresa
// IsPartner: false

// GET /leads
// Retorna:
[
  { id: 1, ownerType: 'EMPRESA' },          // ✅ Vê
  { id: 2, ownerType: 'PARTNER', ownerId: 'uuid-partner-1' },  // ✅ Vê
  { id: 3, ownerType: 'PARTNER', ownerId: 'uuid-partner-2' },  // ✅ Vê
]
```

### Cenário 2: OPERATOR de Partner

```typescript
// Usuário: operator@partner1.com
// Role: OPERATOR
// CompanyId: uuid-partner-1
// IsPartner: true

// GET /leads
// Retorna:
[
  { id: 2, ownerType: 'PARTNER', ownerId: 'uuid-partner-1' },  // ✅ Vê
]
// Não vê: leads da empresa, nem de outros partners
```

### Cenário 3: Criação Manual

```typescript
// OPERATOR da empresa cria lead manual
POST /leads/manual
{
  "name": "João Silva",
  "email": "joao@example.com",
  ...
}

// Lead salvo:
{
  "id": "uuid-novo",
  "source": "MANUAL",
  "ownerType": "EMPRESA",
  "ownerId": null,
  ...
}

// OPERATOR de partner cria lead manual
POST /leads/manual
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  ...
}

// Lead salvo:
{
  "id": "uuid-novo-2",
  "source": "MANUAL",
  "ownerType": "PARTNER",
  "ownerId": "uuid-partner-1",
  ...
}
```

## ✅ Checklist de Implementação

- [x] Enum LeadSource (LANDING_PAGE, MANUAL)
- [x] Enum LeadOwnerType (EMPRESA, PARTNER)
- [x] Campos source, ownerType, ownerId na entity Lead
- [x] Migration com campos de ownership
- [x] CompanyAccessGuard criado
- [x] Interface AccessControl
- [x] Service: buildWhereClause()
- [x] Service: validateAccess()
- [x] Service: findAll() com filtragem
- [x] Service: findOne() com validação
- [x] Service: createManual()
- [x] Controller: POST /leads/manual
- [x] Controller: GET /leads com guard
- [x] Controller: GET /leads/:id com guard
- [x] Documentação completa

## 🧪 Como Testar

### 1. Criar Usuários de Teste

```sql
-- ADMIN
INSERT INTO users (email, role) VALUES ('admin@system.com', 'ADMIN');

-- COADMIN Empresa
INSERT INTO users (email, role, company_id)
VALUES ('coadmin@empresa.com', 'COADMIN', 'uuid-empresa');

-- OPERATOR Empresa
INSERT INTO users (email, role, company_id)
VALUES ('operator@empresa.com', 'OPERATOR', 'uuid-empresa');

-- COADMIN Partner
INSERT INTO users (email, role, company_id)
VALUES ('coadmin@partner.com', 'COADMIN', 'uuid-partner-1');

-- OPERATOR Partner
INSERT INTO users (email, role, company_id)
VALUES ('operator@partner.com', 'OPERATOR', 'uuid-partner-1');
```

### 2. Criar Leads de Teste

```sql
-- Lead da empresa
INSERT INTO leads (owner_type, owner_id) VALUES ('EMPRESA', NULL);

-- Lead do partner 1
INSERT INTO leads (owner_type, owner_id) VALUES ('PARTNER', 'uuid-partner-1');

-- Lead do partner 2
INSERT INTO leads (owner_type, owner_id) VALUES ('PARTNER', 'uuid-partner-2');
```

### 3. Testar Endpoints

```bash
# Login como COADMIN Empresa
POST /auth/login
{ "email": "coadmin@empresa.com", "password": "..." }
# Copiar token

# Listar leads (deve ver todos)
GET /leads
Headers: { Authorization: "Bearer {token}" }
# Deve retornar 3 leads

# Login como OPERATOR Partner
POST /auth/login
{ "email": "operator@partner.com", "password": "..." }

# Listar leads (deve ver apenas do partner)
GET /leads
Headers: { Authorization: "Bearer {token}" }
# Deve retornar 1 lead (apenas partner-1)

# Tentar acessar lead de outro partner (deve falhar)
GET /leads/{id-partner-2}
Headers: { Authorization: "Bearer {token}" }
# Deve retornar 403 Forbidden

# Criar lead manual
POST /leads/manual
Headers: { Authorization: "Bearer {token}" }
Body: { "name": "Test", "email": "test@test.com", ... }
# Lead criado deve ter ownerType=PARTNER, ownerId=uuid-partner-1
```

## 🎯 Próximos Passos

Com Sprint 2 completo, o sistema agora tem controle de acesso multi-tenant robusto. Próximos sprints:

- **Sprint 3**: Cadastro manual de leads com UI
- **Sprint 4**: Qualificação (LEAD → SUSPECT) com distribuidor e consumo
- **Sprint 5**: Verificação de disponibilidade (SUSPECT → PROSPECT)
- **Sprint 6**: Sistema de propostas (já implementado)
- **Sprint 7**: Conversão para cliente (PROSPECT → CLIENTE)
