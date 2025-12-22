# Integração do Formulário de Contato - Sistema Solar

## Visão Geral

Sistema completo de formulário de contato integrado entre frontend e backend, com armazenamento em banco de dados e notificações por email.

## Funcionalidades Implementadas

### 1. Backend - API de Contatos

#### Estrutura de Arquivos
```
backend/src/modules/
├── contacts/
│   ├── entities/contact.entity.ts
│   ├── dto/create-contact.dto.ts
│   ├── contacts.service.ts
│   ├── contacts.controller.ts
│   └── contacts.module.ts
└── mail/
    ├── mail.service.ts
    └── mail.module.ts
```

#### Entidade Contact
- **Tabela**: `contacts`
- **Campos**:
  - `id` (UUID) - Identificador único
  - `name` (string) - Nome completo
  - `email` (string) - E-mail para contato
  - `phone` (string) - Telefone (10-11 dígitos)
  - `company` (string, opcional) - Nome da empresa
  - `message` (text) - Mensagem do contato
  - `status` (enum) - Status do contato (PENDING, CONTACTED, RESOLVED)
  - `createdAt` (timestamp) - Data de criação

#### Endpoints da API

**1. Criar Contato (Público)**
```http
POST /api/v1/contacts
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "11987654321",
  "company": "Empresa XYZ",  // opcional
  "message": "Gostaria de saber mais sobre geração distribuída"
}
```

**Resposta de Sucesso (201)**:
```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "11987654321",
  "company": "Empresa XYZ",
  "message": "Gostaria de saber mais sobre geração distribuída",
  "status": "PENDING",
  "createdAt": "2024-12-22T10:30:00.000Z"
}
```

**2. Listar Contatos (Restrito: ADMIN/COADMIN)**
```http
GET /api/v1/contacts
Authorization: Bearer {token}
```

**3. Buscar Contato por ID (Restrito: ADMIN/COADMIN)**
```http
GET /api/v1/contacts/{id}
Authorization: Bearer {token}
```

### 2. Sistema de E-mails

#### Configuração (.env)
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=sola.guarata@gemail.com
MAIL_PASSWORD=your-app-password-here
MAIL_FROM="Solar <noreply@solar.com.br>"
```

#### E-mails Enviados

**1. Notificação para a Empresa** (sola.guarata@gemail.com)
- Assunto: `[Solar] Novo Contato: {nome}`
- Conteúdo:
  - Dados do contato (nome, email, telefone, empresa)
  - Mensagem completa
  - Data/hora do contato

**2. Confirmação para o Cliente**
- Assunto: `Recebemos seu contato - Solar`
- Conteúdo:
  - Mensagem de agradecimento
  - Confirmação de recebimento
  - Informação sobre prazo de resposta

### 3. Frontend - Formulário Integrado

#### Componente Atualizado
- **Arquivo**: `/home/joseroberto/projetos/solar/frontend/src/components/ContactForm.tsx`

#### Melhorias Implementadas

1. **Integração com API**
   - Requisição POST para `http://localhost:3000/api/v1/contacts`
   - Validação de resposta
   - Tratamento de erros

2. **Estados de Interface**
   - Estado de carregamento (loading)
   - Exibição de erros
   - Tela de sucesso com feedback

3. **UX Melhorada**
   - Botão desabilitado durante envio
   - Mensagem "Enviando..." durante processamento
   - Feedback visual de erro em vermelho
   - Mensagem de sucesso com ícone animado
   - Reset automático do formulário após 5 segundos

## Configuração de E-mail do Gmail

### Passo 1: Ativar Senha de App do Gmail

1. Acesse sua conta Google: https://myaccount.google.com/
2. Vá em "Segurança"
3. Ative "Verificação em duas etapas" (se ainda não estiver ativada)
4. Procure por "Senhas de app"
5. Crie uma nova senha de app para "Email"
6. Copie a senha gerada (16 caracteres)

### Passo 2: Configurar .env

Edite o arquivo `/home/joseroberto/projetos/solar/backend/.env`:

```env
MAIL_USER=sola.guarata@gemail.com
MAIL_PASSWORD=sua-senha-de-app-aqui  # Cole a senha de 16 caracteres
```

### Passo 3: Reiniciar o Backend

```bash
cd /home/joseroberto/projetos/solar/backend
npm run start:dev
```

## Testando o Sistema

### 1. Teste via Frontend

1. Acesse: `http://localhost:5174/`
2. Role até a seção "Fale com um Especialista"
3. Preencha o formulário:
   - Nome: Teste Usuario
   - Email: teste@example.com
   - Telefone: 11987654321
   - Empresa: (opcional)
   - Mensagem: Teste de integração

4. Clique em "Enviar Mensagem"
5. Aguarde a confirmação
6. Verifique os emails:
   - sola.guarata@gemail.com (notificação)
   - teste@example.com (confirmação)

### 2. Teste via POSTMAN

**Request:**
```http
POST http://localhost:3000/api/v1/contacts
Content-Type: application/json

{
  "name": "Teste POSTMAN",
  "email": "teste@example.com",
  "phone": "11987654321",
  "message": "Mensagem de teste via POSTMAN"
}
```

### 3. Verificar no Banco de Dados

```sql
SELECT * FROM contacts ORDER BY "createdAt" DESC;
```

### 4. Ver Contatos no Swagger

1. Acesse: `http://localhost:3000/api`
2. Faça login com credenciais de ADMIN
3. Use o endpoint `GET /api/v1/contacts` para listar todos os contatos

## Fluxo Completo

1. **Usuário preenche formulário** na landing page
2. **Frontend envia dados** para `POST /api/v1/contacts`
3. **Backend valida** os dados (DTOs com class-validator)
4. **Salva no banco** PostgreSQL (tabela `contacts`)
5. **Envia emails** (assíncrono, não bloqueia resposta):
   - Notificação para sola.guarata@gemail.com
   - Confirmação para o email do usuário
6. **Retorna sucesso** para o frontend
7. **Frontend exibe** mensagem de confirmação
8. **Reset automático** do formulário após 5 segundos

## Observações Importantes

### Segurança
- Endpoint de criação de contato é **público** (não requer autenticação)
- Endpoints de listagem/visualização são **restritos** a ADMIN/COADMIN
- Validação de dados no backend com class-validator
- CORS habilitado para localhost:5174

### Email
- **Importante**: Configure a senha de app do Gmail antes de testar
- Emails são enviados de forma assíncrona (não bloqueia a resposta da API)
- Erros de email são logados mas não impedem o salvamento do contato
- Timeout padrão do SMTP: 30 segundos

### Banco de Dados
- A tabela `contacts` foi criada automaticamente
- Status padrão: 'PENDING'
- Ordenação: mais recentes primeiro (`createdAt DESC`)

## Próximos Passos (Sugestões)

1. **Dashboard de Gestão de Contatos**
   - Interface para ADMIN ver/gerenciar contatos
   - Filtros por status, data, etc.
   - Atualização de status (PENDING → CONTACTED → RESOLVED)

2. **Notificações em Tempo Real**
   - WebSocket para notificar ADMIN de novos contatos
   - Badge com contador de contatos pendentes

3. **Exportação de Dados**
   - Exportar contatos para CSV/Excel
   - Relatórios de contatos por período

4. **Integração com CRM**
   - Enviar leads automaticamente para CRM
   - Sincronização bidirecional

5. **Analytics**
   - Métricas de conversão
   - Taxa de resposta
   - Tempo médio de atendimento

## Troubleshooting

### Email não está sendo enviado

1. Verifique se a senha de app está configurada corretamente
2. Verifique os logs do backend para erros de SMTP
3. Teste com Gmail Web para confirmar que a conta está ativa
4. Verifique se a verificação em duas etapas está ativada

### Erro CORS no Frontend

1. Verifique se o backend está rodando em `http://localhost:3000`
2. Confirme que CORS está habilitado no `main.ts`
3. Limpe o cache do navegador

### Dados não aparecem no banco

1. Verifique a conexão com PostgreSQL
2. Confirme que a tabela `contacts` existe
3. Verifique os logs do backend para erros de validação
