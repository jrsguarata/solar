# Landing Pages Personalizadas por Empresa

Este diretório contém as landing pages customizadas para cada empresa que utiliza o sistema.

## 📋 Como Funciona

Cada empresa cadastrada no sistema deve ter uma landing page customizada criada **manualmente antes** do cadastro da empresa. O sistema valida a existência da landing page tanto no frontend quanto no backend.

## 🚀 Como Criar uma Nova Landing Page

### Passo 1: Criar o Componente

Crie um novo arquivo TSX com o nome da empresa seguido de `LandingPage.tsx`:

```bash
# Exemplo para empresa com código COOP01
touch frontend/src/pages/landing/companies/COOP01LandingPage.tsx
```

### Passo 2: Implementar o Componente

Use o exemplo de `EMP01LandingPage.tsx` como template. O componente deve:

1. Receber as props `company` e `companyCode`
2. Exibir informações personalizadas da empresa
3. Ter seções de Contato e Login (obrigatório)
4. Seguir o design system do projeto

**Exemplo:**

```typescript
import { Link } from 'react-router-dom';
import { Sun, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import type { Company } from '../../../models';

interface COOP01LandingPageProps {
  company: Partial<Company>;
  companyCode: string;
}

export function COOP01LandingPage({ company, companyCode }: COOP01LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Seu conteúdo personalizado aqui */}

      {/* Seção de Contato (obrigatória) */}
      <section id="contato">
        {/* ... */}
      </section>

      {/* Link para Login (obrigatório) */}
      <Link to={`/${companyCode}/login`}>
        Fazer Login
      </Link>
    </div>
  );
}
```

### Passo 3: Registrar no Index

Edite o arquivo `index.ts` e adicione:

```typescript
// 1. Importar o novo componente
export { COOP01LandingPage } from './COOP01LandingPage';

// 2. Adicionar ao mapa de componentes
export const companyLandingPages: Record<string, CompanyLandingPageComponent> = {
  'EMP01': require('./EMP01LandingPage').EMP01LandingPage,
  'COOP01': require('./COOP01LandingPage').COOP01LandingPage, // <- ADICIONAR AQUI
};
```

### Passo 4: Registrar no Backend

Edite `backend/src/modules/companies/companies.service.ts`:

```typescript
// Adicionar o código na lista de landing pages válidas
private readonly VALID_LANDING_PAGES = ['EMP01', 'COOP01']; // <- ADICIONAR AQUI
```

### Passo 5: Testar

1. **Testar Landing Page:**
   ```bash
   # Acessar no navegador
   http://localhost:5173/COOP01
   ```

2. **Testar Validação:**
   - Tentar cadastrar empresa com código não listado → Deve dar erro
   - Cadastrar empresa com código válido → Deve funcionar

## 📁 Estrutura de Arquivos

```
frontend/src/pages/landing/companies/
├── README.md                    # Este arquivo
├── index.ts                     # Mapa de componentes
├── EMP01LandingPage.tsx         # Exemplo de landing page
└── [CODIGO]LandingPage.tsx      # Suas novas landing pages
```

## ✅ Checklist para Nova Landing Page

- [ ] Criar arquivo `[CODIGO]LandingPage.tsx`
- [ ] Implementar componente com props corretas
- [ ] Adicionar seção de Contato
- [ ] Adicionar link para Login (/${companyCode}/login)
- [ ] Exportar no `index.ts`
- [ ] Adicionar ao mapa `companyLandingPages`
- [ ] Adicionar código em `VALID_LANDING_PAGES` no backend
- [ ] Testar acessando http://localhost:5173/[CODIGO]
- [ ] Testar cadastro da empresa no sistema

## 🎨 Seções Obrigatórias

Toda landing page deve conter:

1. **Header** - Com logo e botão de login
2. **Hero Section** - Título e chamada para ação
3. **Seção de Contato** - Email, telefone, endereço
4. **Link para Login** - Redirecionando para `/${companyCode}/login`
5. **Footer** - Informações da empresa (CNPJ, copyright)

## 📝 Dados Dinâmicos Disponíveis

O componente recebe as seguintes informações da empresa:

```typescript
company.id        // UUID da empresa
company.code      // Código único (ex: EMP01)
company.name      // Nome da empresa
company.cnpj      // CNPJ formatado
```

## ⚠️ Validações

### Frontend

O sistema verifica se existe landing page **antes** de buscar os dados da empresa:

```typescript
if (!hasCustomLandingPage(companyCode)) {
  throw new Error('Landing page não existe para a empresa...');
}
```

### Backend

O sistema valida ao **criar** uma nova empresa:

```typescript
if (!this.VALID_LANDING_PAGES.includes(createCompanyDto.code)) {
  throw new BadRequestException('Landing page não existe...');
}
```

## 🔄 Fluxo Completo

```
1. Desenvolvedor cria [CODIGO]LandingPage.tsx
   ↓
2. Registra em index.ts (frontend)
   ↓
3. Registra em VALID_LANDING_PAGES (backend)
   ↓
4. Admin acessa dashboard e cria empresa com código [CODIGO]
   ↓
5. Backend valida se landing page existe
   ↓
6. Se OK: Empresa criada
   Se ERRO: "Landing page não existe..."
   ↓
7. Usuário acessa http://localhost:5173/[CODIGO]
   ↓
8. Sistema verifica se landing page existe
   ↓
9. Se OK: Renderiza componente customizado
   Se ERRO: Mostra mensagem de erro
```

## 💡 Dicas

- **Use EMP01LandingPage.tsx como template** - Já tem toda a estrutura necessária
- **Personalize cores e conteúdo** - Cada empresa pode ter seu próprio visual
- **Mantenha a consistência** - Use os mesmos ícones e padrões do sistema
- **Teste antes de cadastrar** - Acesse a landing page antes de criar a empresa
- **Documente customizações** - Se adicionar features únicas, documente aqui

## 🐛 Troubleshooting

### "Landing page não existe para a empresa X"

**Causa:** Landing page não foi criada ou não foi registrada.

**Solução:**
1. Verificar se existe o arquivo `XLandingPage.tsx`
2. Verificar se está exportado em `index.ts`
3. Verificar se está no mapa `companyLandingPages`
4. Verificar se está em `VALID_LANDING_PAGES` no backend

### Componente não renderiza

**Causa:** Erro de sintaxe ou import incorreto.

**Solução:**
1. Verificar console do navegador
2. Verificar se todas as props estão corretas
3. Verificar se os imports estão corretos

### Empresa cadastrada mas landing page não funciona

**Causa:** Landing page foi criada **depois** do cadastro da empresa.

**Solução:**
1. A landing page deve ser criada **antes** do cadastro
2. Se já cadastrou, delete a empresa e cadastre novamente
