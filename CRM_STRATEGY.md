# Estratégia de CRM - Funil de Vendas

## 📋 Visão Geral

Esta estratégia define como utilizar o sistema de contatos e notas para gerenciar o funil de vendas completo, desde o primeiro contato (suspect) até a conversão em cliente, mantendo histórico completo de follow-up.

---

## 🎯 Funil de Vendas - Estágios

### 1. PENDING (Pendente)
**Descrição**: Solicitação de contato recebida pela landing page, ainda não visualizada.

**Ações**:
- Sistema recebe formulário de contato da landing page
- Email automático de confirmação enviado ao solicitante
- Notificação para equipe de atendimento

**Responsável**: Sistema (automático)

**Próximo Estágio**: READ

---

### 2. READ (Lido)
**Descrição**: Contato foi visualizado pela equipe e está em análise inicial.

**Ações Requeridas**:
- Análise do perfil do solicitante
- Verificação de fit com perfil de cliente ideal
- Primeira avaliação de potencial
- Decisão: encaminhar para CRM (SUSPECT) ou resolver diretamente (RESOLVED)

**Responsável**: COADMIN ou OPERATOR

**Notas Esperadas**:
- Análise inicial do perfil
- Potencial identificado
- Próximos passos definidos

**Próximo Estágio**: SUSPECT ou RESOLVED

---

### 3. SUSPECT (Encaminhado ao CRM)
**Descrição**: Cliente em potencial identificado, inicia processo de qualificação e venda.

**Ações Requeridas**:
- Primeiro contato telefônico/email
- Agendamento de reunião inicial
- Apresentação da solução
- Envio de proposta comercial
- Follow-ups regulares
- Negociação

**Responsável**: COADMIN (vendedor responsável)

**Notas Esperadas** (Follow-ups):
- Data/hora de cada contato
- Canal utilizado (telefone, email, WhatsApp, presencial)
- Resumo da conversa
- Objeções levantadas
- Interesse demonstrado
- Próxima ação agendada
- Responsável pela próxima ação

**KPIs**:
- Tempo médio em SUSPECT
- Taxa de conversão SUSPECT → Cliente
- Número de follow-ups até conversão
- Tempo de resposta entre follow-ups

**Próximo Estágio**: Conversão em Cliente (externa ao sistema de Contacts)

---

### 4. RESOLVED (Resolvido)
**Descrição**: Solicitação tratada e encerrada (não é prospect de venda).

**Motivos Comuns**:
- Dúvida geral respondida
- Solicitação de suporte técnico
- Fora do perfil de cliente
- Região não atendida
- Já é cliente (redirecionado)

**Ações**:
- Resposta enviada ao solicitante
- Caso encerrado

**Responsável**: COADMIN ou OPERATOR

**Notas Esperadas**:
- Motivo do encerramento
- Ação tomada
- Se houve resposta ao solicitante

**Próximo Estágio**: Nenhum (final)

---

## 📊 Sistema de Follow-up

### Princípios

1. **Rastreabilidade Total**: Toda interação registrada em ContactNote
2. **Histórico Imutável**: Notas não podem ser editadas ou deletadas
3. **Usuário Identificado**: Cada nota vinculada ao usuário que a criou
4. **Cronologia Clara**: Notas sempre ordenadas por data (mais recente primeiro)

### Template de Nota de Follow-up

Toda nota de follow-up deve conter:

```
[FOLLOW-UP] DD/MM/YYYY HH:MM

Canal: [Telefone/Email/WhatsApp/Presencial/Outro]

Resumo:
- [Breve descrição da interação]

Status do Prospect:
- Interesse: [Alto/Médio/Baixo]
- Objeções: [Listar se houver]
- Fase da Negociação: [Primeiro contato/Proposta enviada/Negociação/Fechamento]

Próxima Ação:
- O quê: [Descrição da próxima ação]
- Quando: [Data prevista]
- Quem: [Responsável]
```

**Exemplo Real**:
```
[FOLLOW-UP] 03/01/2026 14:30

Canal: Telefone

Resumo:
- Retorno da proposta comercial enviada dia 20/12
- Cliente demonstrou interesse mas solicitou desconto adicional
- Orçamento aprovado internamente, aguardando apenas ajuste de preço

Status do Prospect:
- Interesse: Alto
- Objeções: Preço 10% acima do budget
- Fase da Negociação: Negociação

Próxima Ação:
- O quê: Consultar gestor sobre possibilidade de desconto de 8%
- Quando: 04/01/2026
- Quem: João Silva (COADMIN)
```

---

## 🔄 Fluxo de Trabalho Recomendado

### Fase 1: Triagem (PENDING → READ)
**Tempo Máximo**: 24 horas

1. COADMIN/OPERATOR acessa dashboard de contatos
2. Visualiza contatos com status PENDING
3. Abre modal de visualização para ler a solicitação
4. Clica em "Editar"
5. Muda status para READ
6. Adiciona primeira nota com análise inicial

### Fase 2: Qualificação (READ → SUSPECT ou RESOLVED)
**Tempo Máximo**: 48 horas

**Se for prospect qualificado (SUSPECT)**:
1. Muda status para SUSPECT
2. Adiciona nota inicial:
   ```
   [QUALIFICAÇÃO] Cliente qualificado como prospect

   Perfil:
   - Tipo: [Residencial/Comercial/Industrial]
   - Porte: [Pequeno/Médio/Grande]
   - Região: [Cidade/Estado]
   - Potencial Estimado: R$ [valor]

   Próxima Ação:
   - O quê: Primeiro contato telefônico
   - Quando: [Data]
   - Quem: [Nome do vendedor]
   ```
3. Realiza primeiro contato em até 24h

**Se NÃO for prospect (RESOLVED)**:
1. Responde ao solicitante
2. Muda status para RESOLVED
3. Adiciona nota explicando motivo do encerramento

### Fase 3: Vendas (SUSPECT)
**Cadência de Follow-up Recomendada**:

- **Dia 0**: Primeiro contato (telefone)
- **Dia 1**: Follow-up email com material institucional
- **Dia 3-5**: Reunião de apresentação agendada
- **Dia 7**: Envio de proposta comercial
- **Dia 10**: Follow-up da proposta
- **Dia 14**: Segundo follow-up
- **Dia 21**: Reavaliação (manter/descartar)

**Regras**:
- Adicionar nota após CADA interação
- Mínimo 1 follow-up por semana
- Após 30 dias sem resposta: considerar RESOLVED
- Todas as promessas registradas em "Próxima Ação"

### Fase 4: Conversão (SUSPECT → Cliente)
**Ação**: Quando SUSPECT converter em cliente:

1. Manter registro no sistema de Contacts (não mudar status)
2. Adicionar nota final:
   ```
   [CONVERSÃO] Cliente convertido!

   - Contrato assinado em: DD/MM/YYYY
   - Valor do contrato: R$ [valor]
   - Início da prestação de serviços: DD/MM/YYYY
   - Cliente ID no sistema: [ID]

   Próxima Ação:
   - Transferir para equipe de onboarding
   ```
3. **FUTURO**: Criar registro na tabela `clients` (a ser implementada)

---

## 📈 Métricas e Indicadores

### KPIs por Estágio

**PENDING**:
- Tempo médio até primeira visualização
- Meta: < 4 horas em horário comercial

**READ**:
- Tempo médio até qualificação (READ → SUSPECT/RESOLVED)
- Meta: < 48 horas
- Taxa de qualificação (% que vira SUSPECT)
- Meta: > 40%

**SUSPECT**:
- Número médio de follow-ups até conversão
- Benchmark: 5-7 interações
- Tempo médio do ciclo de vendas (SUSPECT → Cliente)
- Benchmark: 15-30 dias
- Taxa de conversão (SUSPECT → Cliente)
- Meta: > 25%
- Distribuição de motivos de perda

**RESOLVED**:
- Distribuição de motivos de encerramento
- Tempo médio de resolução

### Relatórios Sugeridos

1. **Dashboard de Funil**:
   - Quantidade de contatos por estágio
   - Tempo médio em cada estágio
   - Taxa de conversão entre estágios

2. **Relatório de Follow-ups**:
   - Contatos sem follow-up há mais de 7 dias
   - Próximas ações agendadas (calendário)
   - Follow-ups atrasados

3. **Performance de Vendedores**:
   - Número de SUSPECTS atribuídos
   - Taxa de conversão individual
   - Tempo médio de resposta

---

## 🛠️ Implementação Atual vs. Futura

### ✅ Já Implementado

- [x] Sistema de contatos com formulário de landing page
- [x] Status flow: PENDING → READ → SUSPECT/RESOLVED
- [x] Sistema de notas (ContactNote) com:
  - Rastreamento de usuário (createdBy)
  - Timestamp automático (createdAt)
  - Histórico completo em ordem cronológica
  - Relacionamento com User para nome do criador
- [x] Bloqueio de edição para status finais (SUSPECT/RESOLVED)
- [x] Interface de visualização e edição de contatos
- [x] Validação de status obrigatório em edições

### 🔮 Próximos Passos (Roadmap)

#### Sprint 1: Melhorias no Sistema de Follow-up
- [ ] Adicionar campo `nextActionDate` em Contact (data da próxima ação)
- [ ] Adicionar campo `assignedTo` em Contact (vendedor responsável)
- [ ] Dashboard de "Minhas Ações Hoje" (follow-ups agendados)
- [ ] Alertas de follow-ups atrasados
- [ ] Filtros por vendedor, status, data

#### Sprint 2: Analytics e Reporting
- [ ] Página de Analytics com métricas do funil
- [ ] Gráficos de conversão por estágio
- [ ] Relatório de performance por vendedor
- [ ] Exportação de relatórios (CSV/PDF)

#### Sprint 3: Gestão de Clientes
- [ ] Nova entidade `Client` (cliente convertido)
- [ ] Migração automática de SUSPECT → Client
- [ ] Vinculação de Contact original ao Client
- [ ] Dashboard de clientes ativos
- [ ] Histórico completo (prospect + cliente)

#### Sprint 4: Automações
- [ ] Templates de notas de follow-up
- [ ] Agendamento automático de follow-ups
- [ ] Notificações por email de ações pendentes
- [ ] Integração com calendário (Google Calendar)
- [ ] WhatsApp integration para follow-ups

#### Sprint 5: CRM Avançado
- [ ] Pipeline visual (Kanban) de prospects
- [ ] Oportunidades (Deals) vinculadas a Contacts
- [ ] Previsão de receita
- [ ] Gestão de propostas comerciais
- [ ] Assinatura eletrônica de contratos

---

## 👥 Responsabilidades por Perfil

### ADMIN
- Acesso completo a todos os contatos
- Visualização de métricas globais
- Gestão de usuários vendedores
- Configuração de metas e KPIs

### COADMIN (Vendedor/Gestor Comercial)
- Acesso a contatos da sua empresa
- Gerenciamento de SUSPECTS atribuídos
- Adicionar notas de follow-up
- Mudar status de contatos
- Visualizar suas métricas de performance

### OPERATOR
- Triagem inicial (PENDING → READ)
- Qualificação básica (READ → SUSPECT/RESOLVED)
- Adicionar notas de triagem
- Visualizar contatos da sua empresa

### USER
- Sem acesso ao módulo de Contacts/CRM

---

## 📝 Boas Práticas

### Para Vendedores (COADMIN)

1. **Sempre adicionar nota após interação**
   - Não confiar na memória
   - Registrar imediatamente após o contato
   - Ser específico e objetivo

2. **Definir próxima ação em toda nota**
   - O quê será feito
   - Quando será feito
   - Quem é o responsável

3. **Manter cadência de follow-up**
   - Não deixar prospect "esfriar"
   - Máximo 7 dias sem contato
   - Persistência é chave

4. **Ser honesto sobre objeções**
   - Registrar objeções reais do cliente
   - Ajuda equipe a melhorar argumentação
   - Permite identificar padrões

5. **Atualizar status corretamente**
   - SUSPECT: apenas prospects qualificados
   - Não acumular prospects inativos
   - Mover para RESOLVED se não houver avanço

### Para Gestores (ADMIN)

1. **Revisar funil semanalmente**
   - Identificar gargalos
   - Cobrar follow-ups atrasados
   - Celebrar conversões

2. **Acompanhar métricas**
   - Taxa de conversão por vendedor
   - Tempo médio de ciclo
   - Motivos de perda

3. **Dar feedback baseado em dados**
   - Usar histórico de notas para coaching
   - Identificar melhores práticas
   - Corrigir desvios rapidamente

---

## 🎯 Exemplo de Jornada Completa

### Caso: João da Silva - Interesse em Energia Solar

**Dia 0 - 02/01/2026 09:00**
- João preenche formulário na landing page
- Sistema cria Contact com status PENDING
- Email automático enviado para João

**Dia 0 - 02/01/2026 10:30**
- COADMIN Maria visualiza contato
- Muda status para READ
- Adiciona nota:
  ```
  [TRIAGEM] Primeiro contato recebido

  Análise:
  - Cliente residencial em São Paulo/SP
  - Demonstrou interesse em reduzir conta de luz
  - Possui imóvel próprio
  - Conta de luz média: R$ 350/mês

  Avaliação: QUALIFICADO

  Próxima Ação:
  - O quê: Ligar para João para entender melhor necessidade
  - Quando: 02/01/2026 14:00
  - Quem: Maria Santos
  ```

**Dia 0 - 02/01/2026 14:15**
- Maria liga para João
- Muda status para SUSPECT
- Adiciona nota:
  ```
  [FOLLOW-UP] 02/01/2026 14:15

  Canal: Telefone

  Resumo:
  - Ligação durou 15 minutos
  - João confirmou interesse em energia solar
  - Casa de 120m² com 4 pessoas
  - Conta de luz varia entre R$ 300-400
  - Telhado sem sombreamento
  - Orçamento aprovado pela esposa

  Status do Prospect:
  - Interesse: Alto
  - Objeções: Nenhuma até o momento
  - Fase da Negociação: Primeiro contato

  Próxima Ação:
  - O quê: Enviar email com apresentação da empresa e estudos de caso
  - Quando: 02/01/2026 17:00
  - Quem: Maria Santos
  ```

**Dia 1 - 03/01/2026 09:00**
- Maria envia email com material
- Adiciona nota:
  ```
  [FOLLOW-UP] 03/01/2026 09:00

  Canal: Email

  Resumo:
  - Enviado apresentação institucional
  - Incluído 3 estudos de caso similares
  - Agendado visita técnica para 06/01/2026 10:00

  Próxima Ação:
  - O quê: Confirmar visita técnica por WhatsApp
  - Quando: 05/01/2026
  - Quem: Maria Santos
  ```

**Dia 3 - 05/01/2026 15:00**
- Maria confirma visita por WhatsApp
- Adiciona nota:
  ```
  [FOLLOW-UP] 05/01/2026 15:00

  Canal: WhatsApp

  Resumo:
  - João confirmou visita para 06/01 às 10h
  - Enviou fotos do telhado
  - Perguntou sobre prazo de instalação

  Status do Prospect:
  - Interesse: Alto (perguntando detalhes técnicos)
  - Objeções: Nenhuma
  - Fase da Negociação: Agendamento de visita técnica

  Próxima Ação:
  - O quê: Realizar visita técnica e medição
  - Quando: 06/01/2026 10:00
  - Quem: Maria Santos + Técnico
  ```

**Dia 4 - 06/01/2026 12:00**
- Visita técnica realizada
- Adiciona nota:
  ```
  [FOLLOW-UP] 06/01/2026 12:00

  Canal: Presencial

  Resumo:
  - Visita técnica concluída
  - Telhado em boas condições
  - Sistema recomendado: 3.2 kWp (8 módulos)
  - Economia estimada: 95% da conta
  - João muito receptivo
  - Solicitou proposta formal

  Status do Prospect:
  - Interesse: Muito Alto
  - Objeções: Aguardando preço
  - Fase da Negociação: Proposta comercial

  Próxima Ação:
  - O quê: Enviar proposta comercial detalhada
  - Quando: 07/01/2026
  - Quem: Maria Santos
  ```

**Dia 5 - 07/01/2026 16:00**
- Proposta enviada
- Adiciona nota:
  ```
  [FOLLOW-UP] 07/01/2026 16:00

  Canal: Email

  Resumo:
  - Proposta comercial enviada
  - Valor: R$ 18.500 (à vista) ou 24x de R$ 925
  - Prazo de instalação: 30 dias após aprovação
  - Garantia: 25 anos módulos, 5 anos inversor
  - João confirmou recebimento

  Próxima Ação:
  - O quê: Ligar para esclarecer dúvidas sobre proposta
  - Quando: 10/01/2026
  - Quem: Maria Santos
  ```

**Dia 8 - 10/01/2026 11:00**
- Follow-up da proposta
- Adiciona nota:
  ```
  [FOLLOW-UP] 10/01/2026 11:00

  Canal: Telefone

  Resumo:
  - João leu proposta e gostou
  - Solicitou desconto de 5% para pagamento à vista
  - Prazo de decisão: até 15/01
  - Vai consultar mais 2 fornecedores (concorrência)

  Status do Prospect:
  - Interesse: Alto (mas comparando preços)
  - Objeções: Preço (quer desconto)
  - Fase da Negociação: Negociação

  Próxima Ação:
  - O quê: Consultar gestor sobre possibilidade de desconto
  - Quando: 10/01/2026 15:00
  - Quem: Maria Santos
  ```

**Dia 8 - 10/01/2026 17:00**
- Proposta atualizada
- Adiciona nota:
  ```
  [FOLLOW-UP] 10/01/2026 17:00

  Canal: Email + WhatsApp

  Resumo:
  - Aprovado desconto de 3% (R$ 17.945 à vista)
  - Brinde: 1 ano de monitoramento premium grátis
  - Nova proposta enviada
  - João agradeceu e disse que vai analisar

  Próxima Ação:
  - O quê: Acompanhar decisão
  - Quando: 13/01/2026
  - Quem: Maria Santos
  ```

**Dia 11 - 13/01/2026 14:00**
- Cliente aceita proposta
- Adiciona nota:
  ```
  [CONVERSÃO] Cliente convertido!

  - João aceitou proposta de R$ 17.945 à vista
  - Contrato assinado em: 13/01/2026
  - Pagamento confirmado: 13/01/2026
  - Previsão de instalação: 15/02/2026
  - Cliente ID no sistema: CLI-2026-001

  Observações:
  - Cliente muito satisfeito com atendimento
  - Indicou 2 vizinhos interessados
  - Ótima experiência de venda

  Próxima Ação:
  - Transferir para equipe de instalação
  - Manter contato para acompanhamento pós-venda
  ```

**Resultado**:
- Tempo total: 11 dias (muito bom!)
- Número de follow-ups: 8 interações
- Taxa de conversão: 100%
- Valor do contrato: R$ 17.945
- Satisfação do cliente: Alta

---

## 🔐 Segurança e Privacidade

### Dados Sensíveis

- Todas as notas devem seguir LGPD
- Não registrar dados de cartão de crédito em notas
- Não registrar CPF completo (usar apenas final)
- Dados pessoais protegidos por autenticação JWT
- Apenas usuários da mesma empresa acessam os contatos

### Auditoria

- Sistema já possui auditoria completa (audit_logs)
- Toda criação de nota é auditada
- Toda mudança de status é auditada
- Rastreabilidade total de ações

---

## 📞 Suporte e Dúvidas

Para dúvidas sobre esta estratégia ou sugestões de melhorias:
- Contate o ADMIN do sistema
- Consulte a documentação técnica em `/CLAUDE.md`
- Revise os exemplos práticos neste documento

---

**Versão**: 1.0
**Última Atualização**: 03/01/2026
**Autor**: Sistema Solar - Equipe de Produto
**Aprovado por**: Gestão Comercial
