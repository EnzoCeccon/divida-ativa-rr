# 🚀 Guia de Deploy no Firebase

## 📋 Pré-requisitos

1. **Conta Google** - Para acessar o Firebase Console
2. **Node.js** - Versão 16 ou superior
3. **Git** - Para versionamento do código

## 🔧 Configuração Inicial

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Criar projeto"**
3. Digite o nome: `divida-ativa-rr`
4. Desative o Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### 2. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 3. Fazer Login no Firebase

```bash
firebase login
```

Siga as instruções no navegador para autenticar.

### 4. Inicializar o Projeto

```bash
firebase init hosting
```

**Responda às perguntas:**
- Selecione o projeto: `divida-ativa-rr`
- Public directory: `dist`
- Configure as single-page app: `Yes`
- Set up automatic builds: `No`

## 🚀 Deploy Manual

### 1. Build do Projeto

```bash
npm run build
```

### 2. Deploy no Firebase

```bash
firebase deploy
```

Ou use o script npm:

```bash
npm run deploy
```

## 🔄 Deploy Automático (GitHub Actions)

### 1. Configurar Secrets no GitHub

1. Vá para seu repositório no GitHub
2. Settings → Secrets and variables → Actions
3. Adicione os secrets:

**FIREBASE_SERVICE_ACCOUNT:**
1. No Firebase Console, vá em Configurações do Projeto
2. Aba "Contas de serviço"
3. Clique em "Gerar nova chave privada"
4. Copie o conteúdo do JSON gerado
5. Cole no secret `FIREBASE_SERVICE_ACCOUNT`

### 2. Push para Deploy Automático

```bash
git push origin main
```

O deploy acontecerá automaticamente a cada push na branch main.

## 📁 Estrutura de Arquivos

```
divida-ativa/
├── firebase.json          # Configuração do Firebase
├── .firebaserc           # ID do projeto
├── .github/workflows/    # GitHub Actions
└── dist/                 # Build de produção
```

## 🌐 URLs de Acesso

Após o deploy, sua aplicação estará disponível em:

- **Produção**: `https://divida-ativa-rr.web.app`
- **Preview**: `https://divida-ativa-rr.firebaseapp.com`

## 🔧 Comandos Úteis

```bash
# Login no Firebase
firebase login

# Logout do Firebase
firebase logout

# Listar projetos
firebase projects:list

# Deploy apenas hosting
firebase deploy --only hosting

# Deploy com preview
firebase hosting:channel:deploy preview

# Abrir console do Firebase
firebase open

# Ver logs
firebase hosting:channel:list
```

## 🛠️ Troubleshooting

### Erro de Build
```bash
# Limpar cache
npm run build -- --force

# Verificar dependências
npm install
```

### Erro de Deploy
```bash
# Verificar configuração
firebase projects:list

# Reconfigurar projeto
firebase use divida-ativa-rr
```

### Erro de Autenticação
```bash
# Refazer login
firebase logout
firebase login
```

## 📊 Monitoramento

### Firebase Console
- Acesse [console.firebase.google.com](https://console.firebase.google.com)
- Selecione seu projeto
- Vá em "Hosting" para ver estatísticas

### Analytics (Opcional)
1. No Firebase Console, vá em "Analytics"
2. Configure o Google Analytics
3. Adicione o código de rastreamento

## 🔒 Segurança

### Regras de Hosting
O Firebase Hosting já está configurado com:
- Cache otimizado para arquivos estáticos
- Headers de segurança
- Redirecionamento para SPA

### Domínio Personalizado (Opcional)
1. No Firebase Console, vá em "Hosting"
2. Clique em "Adicionar domínio personalizado"
3. Siga as instruções de DNS

## 🎯 Próximos Passos

1. **Configurar domínio personalizado**
2. **Adicionar Analytics**
3. **Configurar notificações de deploy**
4. **Implementar CI/CD avançado**

---

**🎉 Seu dashboard estará online em minutos!**
