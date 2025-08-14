# 📊 Dashboard de Dívida Ativa - Roraima

## 🎯 Sobre o Projeto

Dashboard interativo para visualização e análise de dados de dívida ativa do estado de Roraima. Desenvolvido com React, TypeScript e Material-UI, oferece uma interface moderna e responsiva para análise de dados financeiros.

## ✨ Funcionalidades

### 📈 Dashboard Principal
- **Métricas em tempo real**: Total em dívida, processos ativos, valor recuperado
- **Top 10 maiores dívidas**: Ranking dos maiores devedores
- **Últimos pagamentos**: Histórico de pagamentos realizados
- **Resumo por ano**: Distribuição temporal dos dados

### 🔍 Funcionalidades de Busca
- **Busca por contribuinte**: Encontre dívidas por nome
- **Busca por valor**: Filtre por valores específicos
- **Filtros dinâmicos**: Interface responsiva e intuitiva

### 📊 Visualização de Dados
- **Tabelas organizadas**: Dados estruturados e fáceis de ler
- **Gráficos interativos**: Visualizações claras e informativas
- **Layout responsivo**: Funciona em desktop, tablet e mobile

## 🚀 Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Material-UI (MUI)** - Componentes de interface
- **Vite** - Build tool e dev server
- **Python** - Processamento de dados CSV

## 📁 Estrutura do Projeto

```
divida-ativa/
├── src/
│   ├── components/
│   │   └── Dashboard.tsx          # Componente principal
│   ├── services/
│   │   └── csvService.ts          # Serviço de dados
│   ├── types/
│   │   └── index.ts               # Definições de tipos
│   ├── config/
│   │   └── constants.ts           # Constantes
│   ├── theme.ts                   # Configuração de tema
│   ├── App.tsx                    # App principal
│   └── main.tsx                   # Entry point
├── public/
│   ├── dados-divida-ativa-final.csv    # Dados processados
│   └── nota.svg                   # Assets
├── organizar_dados_final.py       # Script de processamento
└── README.md                      # Documentação
```

## 📊 Dados Processados

### Estatísticas Gerais
- **Total de registros**: 14.615 dívidas únicas
- **Valor total**: R$ 45.618.793.298,00
- **Período**: 2020-2023
- **Anos cobertos**: 4 anos de dados

### Distribuição por Ano
| Ano | Registros | Valor Total |
|-----|-----------|-------------|
| 2020 | 8.235 | R$ 23.999.654.615,00 |
| 2021 | 2.368 | R$ 14.220.369.075,00 |
| 2022 | 1.350 | R$ 7.227.476.385,00 |
| 2023 | 2.662 | R$ 171.293.223,00 |

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Python 3.8+ (para processamento de dados)

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd divida-ativa
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Processe os dados (opcional)
```bash
python organizar_dados_final.py
```

### 4. Execute o projeto
```bash
npm run dev
```

### 5. Acesse a aplicação
Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## 📋 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Gera build de produção
npm run preview      # Visualiza build de produção
npm run lint         # Executa linter
```

## 🔧 Processamento de Dados

### Script Python
O arquivo `organizar_dados_final.py` processa os dados CSV originais:

```bash
python organizar_dados_final.py
```

**Funcionalidades:**
- Limpeza e normalização de dados
- Remoção de duplicatas
- Padronização de formatos
- Geração de estatísticas

### Arquivos de Dados
- `dados-divida-ativa-final.csv` - Dados processados e organizados
- `dados-divida-ativa-organizado.csv` - Versão intermediária
- `dados-divida-ativa-completo.csv` - Versão completa

## 🎨 Personalização

### Tema
O tema pode ser personalizado editando `src/theme.ts`:

```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

### Componentes
Os componentes estão organizados em `src/components/` e podem ser facilmente modificados.

## 📱 Responsividade

O dashboard é totalmente responsivo e funciona em:
- **Desktop**: Layout completo com todas as funcionalidades
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Layout otimizado para telas pequenas

## 🔍 Funcionalidades de Busca

### Busca por Contribuinte
- Digite o nome do contribuinte na barra de busca
- Resultados filtrados em tempo real
- Busca case-insensitive

### Busca por Valor
- Filtre por valores específicos
- Suporte a diferentes formatos de número

## 📈 Métricas Disponíveis

### Dashboard Principal
- **Total em Dívida**: Soma de todas as dívidas ativas
- **Processos Ativos**: Número de processos em andamento
- **Valor Recuperado**: Total de pagamentos realizados
- **Total de Contribuintes**: Número único de devedores

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Deploy no GitHub Pages
1. Configure o repositório no GitHub
2. Ative GitHub Pages nas configurações
3. Configure a branch de deploy

### Deploy no Firebase
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Instale o Firebase CLI: `npm install -g firebase-tools`
3. Faça login: `firebase login`
4. Inicialize o projeto: `firebase init hosting`
5. Deploy: `npm run deploy`

### Deploy no Vercel
1. Conecte o repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma issue no GitHub
- Entre em contato através do email

## 🎯 Roadmap

- [ ] Gráficos interativos
- [ ] Exportação de relatórios
- [ ] Filtros avançados
- [ ] Dashboard administrativo
- [ ] Integração com APIs externas

---

**Desenvolvido com ❤️ para a transparência pública**

