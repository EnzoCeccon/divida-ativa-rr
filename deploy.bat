@echo off
echo 🚀 Iniciando deploy do Dashboard de Dívida Ativa...
echo.

echo 📦 Fazendo build do projeto...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Erro no build!
    pause
    exit /b 1
)

echo.
echo 🔥 Fazendo deploy no Firebase...
firebase deploy

if %errorlevel% neq 0 (
    echo ❌ Erro no deploy!
    pause
    exit /b 1
)

echo.
echo ✅ Deploy concluído com sucesso!
echo 🌐 Acesse: https://divida-ativa-rr.web.app
echo.
pause
