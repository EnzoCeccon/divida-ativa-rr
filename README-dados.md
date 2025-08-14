# 📊 Documentação dos Dados - Dívida Ativa

## 📁 Arquivos de Dados

### `dados-divida-ativa-limpo.csv`
Arquivo CSV principal com dados de exemplo organizados e estruturados para a aplicação de Dívida Ativa.

## 🗂️ Estrutura das Tabelas

### 1. **CONTRIBUINTES** (10 registros)
Informações dos contribuintes (pessoas físicas e jurídicas).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_contribuinte` | Integer | Identificador único |
| `nome` | String | Nome completo ou razão social |
| `cpf_cnpj` | String | CPF ou CNPJ formatado |
| `email` | String | Email de contato |
| `telefone` | String | Telefone com DDD |
| `endereco` | String | Endereço completo |
| `cidade` | String | Cidade |
| `estado` | String | Estado (UF) |
| `cep` | String | CEP formatado |

### 2. **DÍVIDAS** (15 registros)
Registro das dívidas ativas dos contribuintes.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_divida` | Integer | Identificador único |
| `id_contribuinte` | Integer | FK para Contribuinte |
| `valor_original` | Decimal | Valor original da dívida |
| `valor_atual` | Decimal | Valor atual (com juros/multas) |
| `data_vencimento` | Date | Data de vencimento |
| `data_inclusao` | Date | Data de inclusão na dívida ativa |
| `status` | String | Status da dívida (ATIVA) |
| `tipo_tributo` | String | Tipo do tributo (IPTU/ISS) |
| `descricao` | String | Descrição da dívida |

### 3. **PROCESSOS** (15 registros)
Processos judiciais relacionados às dívidas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_processo` | Integer | Identificador único |
| `id_divida` | Integer | FK para Dívida |
| `numero_processo` | String | Número do processo judicial |
| `data_abertura` | Date | Data de abertura do processo |
| `status_processo` | String | Status do processo |
| `valor_processo` | Decimal | Valor em execução |
| `advogado` | String | Nome do advogado responsável |
| `observacoes` | String | Observações do processo |

### 4. **PAGAMENTOS** (10 registros)
Registro dos pagamentos realizados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_pagamento` | Integer | Identificador único |
| `id_divida` | Integer | FK para Dívida |
| `valor_pago` | Decimal | Valor do pagamento |
| `data_pagamento` | Date | Data do pagamento |
| `forma_pagamento` | String | Forma de pagamento |
| `status_pagamento` | String | Status do pagamento |
| `observacoes` | String | Observações do pagamento |

### 5. **PARCELAS** (15 registros)
Parcelas das dívidas em execução.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id_parcela` | Integer | Identificador único |
| `id_divida` | Integer | FK para Dívida |
| `numero_parcela` | Integer | Número da parcela |
| `valor_parcela` | Decimal | Valor da parcela |
| `data_vencimento` | Date | Data de vencimento |
| `status_parcela` | String | Status da parcela |

## 🔗 Relacionamentos

```
CONTRIBUINTES (1) ←→ (N) DÍVIDAS
DÍVIDAS (1) ←→ (N) PROCESSOS
DÍVIDAS (1) ←→ (N) PAGAMENTOS
DÍVIDAS (1) ←→ (N) PARCELAS
```

## 📈 Estatísticas dos Dados

### Contribuintes
- **Total**: 10 contribuintes
- **Pessoas Físicas**: 7 (70%)
- **Pessoas Jurídicas**: 3 (30%)

### Dívidas
- **Total**: 15 dívidas
- **Valor Total Original**: R$ 318.500,00
- **Valor Total Atual**: R$ 398.125,00
- **IPTU**: 8 dívidas (53%)
- **ISS**: 7 dívidas (47%)

### Processos
- **Total**: 15 processos
- **Status**: Todos em andamento
- **Valor Total**: R$ 398.125,00

### Pagamentos
- **Total**: 10 pagamentos
- **Valor Total**: R$ 89.000,00
- **Formas**: PIX, Boleto, Cartão de Crédito

## 🚀 Como Usar os Dados

### 1. **Importação no Dashboard**
```javascript
// Exemplo de importação dos dados
import dadosCSV from './dados-divida-ativa-limpo.csv';

// Processar dados para o dashboard
const processarDados = (csvData) => {
  // Lógica de processamento
};
```

### 2. **Cálculos de Métricas**
```javascript
// Total em dívida
const totalDivida = dividas.reduce((acc, d) => acc + d.valor_atual, 0);

// Processos ativos
const processosAtivos = processos.filter(p => p.status_processo === 'EM_ANDAMENTO').length;

// Valor recuperado
const valorRecuperado = pagamentos.reduce((acc, p) => acc + p.valor_pago, 0);
```

### 3. **Filtros e Busca**
```javascript
// Buscar por contribuinte
const buscarPorNome = (nome) => {
  return contribuintes.filter(c => 
    c.nome.toLowerCase().includes(nome.toLowerCase())
  );
};

// Filtrar por tipo de tributo
const filtrarPorTributo = (tipo) => {
  return dividas.filter(d => d.tipo_tributo === tipo);
};
```

## 📊 Exemplos de Consultas

### Top 5 Maiores Dívidas
```sql
SELECT c.nome, d.valor_atual, d.tipo_tributo
FROM dividas d
JOIN contribuintes c ON d.id_contribuinte = c.id_contribuinte
ORDER BY d.valor_atual DESC
LIMIT 5;
```

### Resumo por Tipo de Tributo
```sql
SELECT 
  tipo_tributo,
  COUNT(*) as quantidade,
  SUM(valor_atual) as valor_total
FROM dividas
GROUP BY tipo_tributo;
```

### Pagamentos por Mês
```sql
SELECT 
  DATE_FORMAT(data_pagamento, '%Y-%m') as mes,
  SUM(valor_pago) as total_pago
FROM pagamentos
GROUP BY mes
ORDER BY mes;
```

## 🔧 Manutenção dos Dados

### Adicionar Novos Registros
1. Manter a estrutura de campos
2. Usar IDs sequenciais
3. Manter relacionamentos válidos
4. Validar formatos de data e valores

### Atualizar Dados
1. Manter integridade referencial
2. Atualizar valores calculados
3. Registrar histórico de mudanças
4. Validar consistência

## 📝 Notas Importantes

- ✅ Dados são fictícios para demonstração
- ✅ Estrutura realista para ambiente de produção
- ✅ Relacionamentos consistentes
- ✅ Formatos padronizados
- ✅ Cobertura de cenários comuns

## 🎯 Próximos Passos

1. **Implementar importação automática**
2. **Criar validações de dados**
3. **Adicionar mais cenários de teste**
4. **Implementar backup automático**
5. **Criar relatórios personalizados**
