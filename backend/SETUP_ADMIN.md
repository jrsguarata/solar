# 🔐 Como Criar o Primeiro Usuário ADMIN

Este documento explica as diferentes formas de criar o primeiro usuário administrador do sistema.

---

## 📋 Opções Disponíveis

### **Opção 1: Endpoint de Setup (Recomendado para Primeira Execução)** ⚡

Use o endpoint público temporário que só funciona quando não há nenhum ADMIN no sistema.

**Endpoint:** `POST /api/v1/auth/setup/initial-admin`

**Requisição:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/setup/initial-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@solar.com",
    "name": "Administrador do Sistema",
    "mobile": "11987654321",
    "password": "SenhaSegura@123"
  }'
```

**Via Swagger:**
1. Acesse: http://localhost:3000/api
2. Navegue até `auth > POST /auth/setup/initial-admin`
3. Clique em "Try it out"
4. Preencha os dados:
   ```json
   {
     "email": "admin@solar.com",
     "name": "Administrador do Sistema",
     "mobile": "11987654321",
     "password": "SenhaSegura@123"
   }
   ```
5. Execute

**Resposta de Sucesso:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "uuid-do-usuario",
    "email": "admin@solar.com",
    "name": "Administrador do Sistema",
    "role": "ADMIN"
  }
}
```

**⚠️ Importante:**
- Este endpoint **só funciona uma vez**
- Após criar o primeiro ADMIN, ele retornará erro 403
- O administrador já estará logado (recebe tokens)

---

### **Opção 2: Script de Seed (Desenvolvimento)** 🌱

Use o script de seed para popular o banco com o usuário padrão.

**Comando:**
```bash
cd backend
npm run seed
```

**Credenciais padrão criadas:**
- **Email:** `admin@solar.com`
- **Senha:** `Admin@123`

**⚠️ ATENÇÃO:**
- Altere a senha após o primeiro login em produção!
- O script não sobrescreve se já existir um ADMIN

**Saída esperada:**
```
🌱 Iniciando seeds...

✅ Conectado ao banco de dados

✅ Usuário ADMIN criado com sucesso!
   Email: admin@solar.com
   Senha: Admin@123
   ⚠️  ALTERE A SENHA EM PRODUÇÃO!

✅ Seeds executados com sucesso!
```

---

### **Opção 3: SQL Direto (Emergência)** 💾

Execute SQL diretamente no PostgreSQL.

**Conectar ao banco:**
```bash
# Via Docker
docker exec -it solar-postgres psql -U postgres -d solar

# Via instalação local
psql -h localhost -U postgres -d solar
```

**Executar SQL:**
```sql
-- Inserir usuário ADMIN
-- Senha: Admin@123 (hash bcrypt com 10 rounds)
INSERT INTO users (
  id,
  email,
  name,
  password,
  role,
  is_active,
  company_id,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid(),
  'admin@solar.com',
  'Administrador do Sistema',
  '$2b$10$rYvL5qH3qKqN1jXzJy9HZOz7xR1vK5Qw8yU7Xz9Hj5Lq3Nz7Xw8Yy',
  'ADMIN',
  true,
  NULL,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verificar criação
SELECT id, email, name, role, is_active, created_at
FROM users
WHERE email = 'admin@solar.com';
```

**⚠️ Importante:**
- O hash de senha acima é **apenas para desenvolvimento**
- Use esta opção apenas em caso de emergência
- Em produção, gere um novo hash com senha forte

**Gerar novo hash de senha (Node.js):**
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('SuaSenhaForte@123', 10, (err, hash) => console.log(hash));"
```

---

## 🔄 Após Criar o ADMIN

### 1. **Fazer Login**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@solar.com",
    "password": "Admin@123"
  }'
```

### 2. **Alterar a Senha (Recomendado)**

Use o token de acesso para atualizar o perfil:

```bash
curl -X PATCH http://localhost:3000/api/v1/users/{USER_ID} \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NovaSenhaSegura@2024!"
  }'
```

### 3. **Criar Outras Empresas e Usuários**

Agora você pode:
- ✅ Criar empresas (apenas ADMIN)
- ✅ Criar usuários COADMIN para empresas
- ✅ Criar usuários OPERATOR e USER

---

## 🛡️ Segurança

### **Boas Práticas:**

1. ✅ **Altere a senha padrão imediatamente**
2. ✅ **Use senhas fortes** (mín. 8 caracteres, maiúsculas, minúsculas, números, símbolos)
3. ✅ **Não compartilhe as credenciais de ADMIN**
4. ✅ **Em produção, desabilite o endpoint de setup** após criar o primeiro admin
5. ✅ **Mantenha logs de acesso** do usuário ADMIN

### **Senha Forte:**
- Mínimo 12 caracteres
- Letras maiúsculas e minúsculas
- Números
- Símbolos especiais
- Não use palavras do dicionário

**Exemplo de senha forte:**
```
gU4r@_0r1g3m!d3_Tud0#2024
```

---

## ❓ Troubleshooting

### **Erro: "Sistema já possui um administrador"**

**Causa:** Já existe um usuário com perfil ADMIN no banco.

**Solução:**
1. Use login com as credenciais existentes
2. Ou recupere o acesso via SQL:
   ```sql
   SELECT email FROM users WHERE role = 'ADMIN';
   ```

### **Erro: "Email já existe"**

**Causa:** O email já está cadastrado (mesmo que não seja ADMIN).

**Solução:**
- Use outro email
- Ou verifique qual perfil tem esse email:
  ```sql
  SELECT email, role FROM users WHERE email = 'admin@solar.com';
  ```

### **Esqueci a senha do ADMIN**

**Solução:** Reset via SQL:
```sql
-- Gerar novo hash primeiro com bcrypt, depois:
UPDATE users
SET password = '$2b$10$SEU_NOVO_HASH_AQUI'
WHERE email = 'admin@solar.com' AND role = 'ADMIN';
```

---

## 📚 Referências

- [Documentação Completa](../CLAUDE.md)
- [API Swagger](http://localhost:3000/api)
- [Hierarquia de Perfis](../CLAUDE.md#hierarquia-de-perfis)
