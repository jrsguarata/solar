# Separação: Contacts vs Leads

## 📋 Visão Geral

Este documento explica a arquitetura de separação entre **Contacts** (Contatos) e **Leads** (Leads de Vendas) no sistema.

---

## 🎯 Finalidades Distintas

### 📧 **Contacts** - Contatos Gerais
**Finalidade**: Formulário de contato geral da landing page

- Qualquer pessoa pode enviar um contato
- Não necessariamente é um lead de vendas
- Pode ser para:
  - Dúvidas gerais
  - Suporte
  - Parcerias
  - Informações
  - Solicitações diversas

**Status Possíveis**:
- `PENDING` - Contato recebido, aguardando leitura
- `READ` - Contato lido pela equipe
- `SUSPECT` - Identificado como potencial cliente (pode virar Lead)
- `RESOLVED` - Solicitação resolvida (não é venda)

**Casos de Uso**:
- Cliente enviou dúvida sobre como funciona o sistema
- Parceiro solicitando informações sobre revenda
- Pessoa perguntando sobre instalação na sua região
- Solicitação de contato comercial

---

### 💼 **Leads** - Funil de Vendas
**Finalidade**: Gestão completa do processo comercial

- Registro de potenciais clientes
- Acompanhamento do funil de vendas
- Histórico de interações
- Propostas comerciais
- Controle de responsáveis

**Status (Fluxo do Funil)**:
1. `LEAD` - Contato inicial capturado
2. `SUSPECT` - Qualificação inicial feita
3. `PROSPECT` - Potencial cliente identificado
4. `QUALIFIED` - Cliente qualificado (fit confirmado)
5. `PROPOSAL_SENT` - Proposta comercial enviada
6. `NEGOTIATION` - Em negociação
7. `WON` - Venda ganha ✅
8. `LOST` - Venda perdida ❌
9. `ARCHIVED` - Arquivado 📦

**Casos de Uso**:
- Formulário da landing page preenchido (interesse em energia solar)
- Lead criado manualmente pelo vendedor
- Cliente importado de planilha
- Lead de parceiro/integração externa

---

## 🏗️ Arquitetura

### Backend

```
backend/src/modules/
├── contacts/                    # Módulo de Contatos
│   ├── entities/
│   │   ├── contact.entity.ts           # Entidade Contact
│   │   └── contact-note.entity.ts      # Notas internas do contato
│   ├── dto/
│   │   ├── create-contact.dto.ts
│   │   └── update-contact.dto.ts
│   ├── contacts.service.ts             # Lógica de negócio
│   ├── contacts.controller.ts          # Endpoints da API
│   └── contacts.module.ts
│
└── leads/                       # Módulo de Leads (Funil de Vendas)
    ├── entities/
    │   ├── lead.entity.ts              # Entidade Lead (funil completo)
    │   ├── lead-note.entity.ts         # Histórico de interações
    │   └── lead-proposal.entity.ts     # Propostas comerciais
    ├── dto/
    │   ├── create-lead.dto.ts
    │   └── update-lead.dto.ts
    ├── leads.service.ts                # Lógica do funil de vendas
    ├── leads.controller.ts             # Endpoints da API
    └── leads.module.ts
```

### Banco de Dados

**Tabelas**:
- `contacts` - Contatos gerais da landing page
- `contact_notes` - Notas internas sobre contatos
- `leads` - Leads do funil de vendas
- `lead_notes` - Histórico de interações com leads
- `lead_proposals` - Propostas comerciais enviadas

---

## 🔄 Fluxo de Trabalho

### Cenário 1: Contato Geral (não é venda)

```
1. Cliente preenche formulário → cria CONTACT (status: PENDING)
2. Equipe lê o contato → atualiza status para READ
3. Identifica que não é venda → atualiza para RESOLVED
4. Fim (não vira Lead)
```

### Cenário 2: Contato que vira Lead

```
1. Cliente preenche formulário → cria CONTACT (status: PENDING)
2. Equipe lê e identifica interesse comercial → status SUSPECT
3. Vendedor cria LEAD manualmente com os dados do contato
4. Lead entra no funil: LEAD → SUSPECT → PROSPECT → ...
5. Contact mantém status SUSPECT (registro histórico)
```

### Cenário 3: Lead Direto (formulário específico)

```
1. Cliente preenche formulário de orçamento → cria LEAD direto
2. Vendedor qualifica → SUSPECT → PROSPECT → QUALIFIED
3. Envia proposta comercial → PROPOSAL_SENT
4. Cliente negocia → NEGOTIATION
5. Cliente fecha → WON
```

---

## 📊 Diferenças Chave

| Aspecto | Contacts | Leads |
|---------|----------|-------|
| **Finalidade** | Contato geral | Funil de vendas |
| **Origem** | Formulário landing page | Landing + Manual + Import + API |
| **Status** | 4 status simples | 9 status (fluxo completo) |
| **Campos** | Dados básicos + mensagem | Dados completos + energia + empresa |
| **Relacionamentos** | Notas internas | Notas + Propostas + Responsável |
| **Multi-tenant** | Não | Sim (EMPRESA/PARTNER) |
| **Responsável** | Não | Sim (assignedTo) |
| **Propostas** | Não | Sim (com upload de arquivo) |
| **Informações de Energia** | Não | Sim (consumo, valor conta, concessionária) |

---

## 🎨 Frontend

### ContactsPage
- Listagem de contatos gerais
- Status simples: PENDING, READ, SUSPECT, RESOLVED
- Visualização de mensagem
- Adicionar notas internas
- Marcar como lido/resolvido

### LeadsPage
- Listagem de leads no funil
- Filtros por status (LEAD, SUSPECT, PROSPECT, etc.)
- Kanban ou tabela
- Criar lead manualmente
- Atualizar status (avançar no funil)
- Atribuir responsável
- Adicionar notas de interação
- Enviar propostas comerciais
- Marcar como WON/LOST

---

## 🔐 Controle de Acesso

### Contacts
- **ADMIN**: Acesso total
- **COADMIN**: Vê todos os contatos
- **OPERATOR**: Não tem acesso
- **USER**: Não tem acesso

### Leads
- **ADMIN**: Acesso total (todos os leads)
- **COADMIN da EMPRESA**: Vê todos (empresa + partners)
- **COADMIN de PARTNER**: Vê apenas leads do seu partner
- **OPERATOR da EMPRESA**: Vê apenas leads da empresa
- **OPERATOR de PARTNER**: Vê apenas leads do seu partner

---

## 📝 Endpoints da API

### Contacts
```
POST   /contacts              # Criar contato (público)
GET    /contacts              # Listar todos (autenticado)
GET    /contacts/:id          # Buscar por ID
PATCH  /contacts/:id          # Atualizar status/notas
```

### Leads
```
POST   /leads                 # Criar lead (público - formulário)
POST   /leads/manual          # Criar lead manual (autenticado)
GET    /leads                 # Listar todos (multi-tenant)
GET    /leads/:id             # Buscar por ID
PATCH  /leads/:id             # Atualizar lead
PATCH  /leads/:id/advance     # Avançar no funil
PATCH  /leads/:id/won         # Marcar como ganho
PATCH  /leads/:id/lost        # Marcar como perdido
PATCH  /leads/:id/archive     # Arquivar
```

---

## ✅ Benefícios da Separação

1. **Clareza de Propósito**: Cada tabela tem uma finalidade clara
2. **Dados Adequados**: Campos específicos para cada contexto
3. **Fluxos Diferentes**: Processos separados e bem definidos
4. **Performance**: Queries mais eficientes (tabelas menores)
5. **Manutenção**: Código mais organizado e fácil de manter
6. **Relatórios**: Métricas específicas para cada módulo
7. **Permissões**: Controles de acesso diferentes

---

## 🚀 Próximos Passos

1. ✅ Restaurar módulo Contacts original
2. ✅ Criar módulo Leads separado
3. ✅ Implementar migration
4. ⏳ Atualizar frontend (models e services)
5. ⏳ Criar páginas separadas no dashboard
6. ⏳ Testar ambos os fluxos
7. ⏳ Documentar APIs no Swagger

---

## 💡 Dica de Uso

**Quando usar cada um:**

- Use **Contact** quando:
  - Cliente enviou dúvida geral
  - Solicitação não comercial
  - Suporte ou informação
  - Ainda não sabe se é venda

- Use **Lead** quando:
  - Cliente demonstrou interesse comercial
  - Quer orçamento/proposta
  - Está no processo de venda
  - Precisa acompanhamento do funil

**Conversão Contact → Lead:**
Quando um Contact é identificado como oportunidade comercial, o vendedor cria um Lead manualmente com os dados do contato.

---

**Última atualização**: Janeiro 2026
