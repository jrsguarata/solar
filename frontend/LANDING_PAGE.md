# Landing Page - Sistema Solar

## Funcionalidades Implementadas

### 1. Header Fixo com Navegação
- Logo clicável que retorna ao início
- Menu de navegação para todas as seções
- Botão de login integrado
- Menu mobile responsivo (hamburguer)
- Navegação suave (smooth scroll) entre seções

### 2. Seções da Landing Page

Todas as seções possuem IDs únicos para navegação por âncoras:

- **#home** - Hero Section (Início)
- **#about-gd** - Sobre Geração Distribuída
- **#contact** - Formulário de Contato
- **#company** - Sobre a Companhia

### 3. Página de Login

Nova rota: `/login`

**Características:**
- Design responsivo e profissional
- Integração com API do backend (`http://localhost:3000/api/v1/auth/login`)
- Validação de campos (email e senha)
- Exibição de erros de autenticação
- Botão "mostrar/ocultar senha"
- Opção "Lembrar-me"
- Link para voltar ao site
- Armazenamento de tokens (accessToken e refreshToken) no localStorage

**Fluxo de Autenticação:**
1. Usuário preenche email e senha
2. Requisição POST para `/api/v1/auth/login`
3. Em caso de sucesso:
   - Armazena accessToken, refreshToken e dados do usuário no localStorage
   - Redireciona para `/dashboard` (ainda não implementado)
4. Em caso de erro:
   - Exibe mensagem de erro em português

### 4. Estrutura de Arquivos

```
frontend/src/
├── components/
│   ├── Header.tsx          (novo - cabeçalho com navegação)
│   ├── Hero.tsx           (atualizado - adicionado id="home" e pt-16)
│   ├── AboutGD.tsx        (atualizado - adicionado id="about-gd")
│   ├── ContactForm.tsx    (atualizado - adicionado id="contact")
│   ├── AboutCompany.tsx   (atualizado - adicionado id="company")
│   └── Footer.tsx
├── pages/
│   ├── Home.tsx           (novo - página inicial)
│   └── Login.tsx          (novo - página de login)
└── App.tsx                (atualizado - configurado React Router)
```

## Como Usar

### Navegação na Landing Page

Acesse: `http://localhost:5174/`

O header permite navegar entre as seções:
- Clique em "Início" para ir ao topo
- Clique em "Sobre GD" para ver informações sobre Geração Distribuída
- Clique em "Contato" para acessar o formulário
- Clique em "Sobre Nós" para conhecer a empresa

### Acessar o Login

Duas formas:
1. Clique no botão "Entrar" no header
2. Acesse diretamente: `http://localhost:5174/login`

### Fazer Login

1. Use credenciais válidas cadastradas no backend
2. Exemplo para admin (se criado via setup):
   ```
   Email: admin@admin.com
   Senha: admin@1234
   ```
3. Após login bem-sucedido, será redirecionado para `/dashboard`

## Integrações

### Backend API

A página de login integra com:
- **Endpoint:** `POST http://localhost:3000/api/v1/auth/login`
- **Body:**
  ```json
  {
    "email": "usuario@example.com",
    "password": "senha123"
  }
  ```
- **Resposta esperada:**
  ```json
  {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "usuario@example.com",
      "name": "Nome do Usuário",
      "mobile": "11987654321",
      "role": "USER",
      "companyId": "uuid"
    }
  }
  ```

## Próximos Passos

1. Implementar página de Dashboard
2. Criar sistema de proteção de rotas (PrivateRoute)
3. Implementar refresh token automático
4. Adicionar página de recuperação de senha
5. Criar página de cadastro (se necessário)

## Tecnologias Utilizadas

- React 19
- TypeScript
- React Router DOM 7
- Tailwind CSS 3
- Lucide React (ícones)
- Vite (build tool)
