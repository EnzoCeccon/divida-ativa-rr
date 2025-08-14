# Dados de Dívida Ativa - Estrutura Organizada

## Visão Geral

Os dados de dívida ativa foram organizados e limpos para melhor utilização na aplicação. O arquivo original continha inconsistências que foram corrigidas.

## Arquivos

- **Original**: `dados-divida-ativa.csv` (1.5MB, 55.567 linhas)
- **Organizado**: `dados-divida-ativa-organizado.csv` (14.615 registros únicos)

## Estrutura dos Dados Organizados

### Colunas do CSV Organizado

| Coluna | Descrição | Tipo | Exemplo |
|--------|-----------|------|---------|
| contribuinte | Nome do contribuinte | String | "SALES E AMORIM LTDA ME" |
| valor_parcelas | Valor total das parcelas | Float | 1867.37 |
| parcelas_adicionadas | Quantidade de parcelas | String | "1" ou "1 \| 1" |
| parcelas_valores | Valores individuais das parcelas | String | "1867.37" ou "952,17 \| 788,51" |
| data_entrada | Data de entrada da dívida | Date | "2020-11-03" |
| ano | Ano da dívida | Integer | 2020 |
| aba | Aba/folha de origem | String | "Folha1" |
| num_parcelas | Número de parcelas (calculado) | Integer | 1 |

## Estatísticas dos Dados

### Distribuição por Ano

- **2020**: 8.235 registros - R$ 23.999.654.615,00
- **2021**: 2.368 registros - R$ 14.220.369.075,00  
- **2022**: 1.350 registros - R$ 7.227.476.385,00
- **2023**: 2.662 registros - R$ 171.293.223,00

### Total Geral

- **Registros únicos**: 14.615
- **Valor total**: R$ 45.618.793.298,00
- **Contribuintes únicos**: 14.615

## Melhorias Implementadas

### 1. Limpeza de Dados
- Remoção de cabeçalhos duplicados
- Eliminação de campos vazios
- Padronização de formatos de data
- Conversão de valores monetários

### 2. Normalização
- Remoção de registros duplicados
- Padronização de nomes de contribuintes
- Conversão de valores para formato numérico
- Organização cronológica

### 3. Estruturação
- Separação clara de campos
- Validação de dados
- Cálculo automático de número de parcelas
- Identificação de anos

## Como Usar na Aplicação

A aplicação React agora carrega automaticamente o arquivo organizado (`dados-divida-ativa-organizado.csv`) e, caso não esteja disponível, faz fallback para o arquivo original.

### Serviço CSV Atualizado

O `CSVService` foi atualizado para:

1. **Carregar dados organizados** por padrão
2. **Fallback automático** para dados originais
3. **Processamento otimizado** dos dados
4. **Melhor tratamento de erros**

### Funcionalidades Disponíveis

- **Dashboard com métricas** em tempo real
- **Top 10 maiores dívidas**
- **Resumo por ano**
- **Busca e filtros**
- **Visualização de todas as dívidas**

## Scripts de Processamento

### Organizar Dados
```bash
py organizar_dados_melhorado.py
```

### Resultado
- Gera `dados-divida-ativa-organizado.csv`
- Exibe estatísticas detalhadas
- Remove duplicatas automaticamente
- Valida integridade dos dados

## Próximos Passos

1. **Implementar cache** para melhor performance
2. **Adicionar paginação** para grandes volumes
3. **Criar filtros avançados** por período
4. **Exportar relatórios** em diferentes formatos
5. **Implementar busca por CPF/CNPJ**

## Notas Técnicas

- **Encoding**: UTF-8
- **Separador**: Vírgula (,)
- **Formato de data**: YYYY-MM-DD
- **Formato de valor**: Decimal com ponto (.)
- **Backup**: Arquivo original mantido como referência
