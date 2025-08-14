import csv
import re
from datetime import datetime
from typing import List, Dict, Any

def limpar_valor_monetario(valor_str: str) -> float:
    """Limpa e converte string de valor monetário para float"""
    if not valor_str:
        return 0.0
    
    # Remove R$, espaços e converte vírgula para ponto
    valor_limpo = re.sub(r'[R$\s]', '', valor_str)
    valor_limpo = valor_limpo.replace('.', '').replace(',', '.')
    
    try:
        return float(valor_limpo)
    except ValueError:
        return 0.0

def padronizar_data(data_str: str) -> str:
    """Padroniza diferentes formatos de data para YYYY-MM-DD"""
    if not data_str:
        return ''
    
    try:
        # Remove horário se existir
        data_str = data_str.split(' ')[0].split('T')[0]
        
        # Tenta diferentes formatos
        formatos = [
            '%Y-%m-%d',
            '%d/%m/%Y',
            '%m/%d/%Y',
            '%d-%m-%Y',
            '%m-%d-%Y'
        ]
        
        for formato in formatos:
            try:
                return datetime.strptime(data_str, formato).strftime('%Y-%m-%d')
            except ValueError:
                continue
        
        return data_str
    except:
        return ''

def processar_linha_csv(linha: str) -> Dict[str, Any]:
    """Processa uma linha do CSV e retorna um dicionário com os dados organizados"""
    # Remove aspas e divide por vírgulas
    campos = []
    campo_atual = ''
    dentro_aspas = False
    
    for char in linha:
        if char == '"':
            dentro_aspas = not dentro_aspas
        elif char == ',' and not dentro_aspas:
            campos.append(campo_atual.strip())
            campo_atual = ''
        else:
            campo_atual += char
    
    campos.append(campo_atual.strip())
    
    # Remove campos vazios no final
    campos = [campo for campo in campos if campo]
    
    if len(campos) < 5:
        return None
    
    try:
        contribuinte = campos[0].strip()
        valor_parcelas = limpar_valor_monetario(campos[1])
        parcelas_adicionadas = campos[2].strip() if len(campos) > 2 else '1'
        parcelas_valores = campos[3].strip() if len(campos) > 3 else str(valor_parcelas)
        data_entrada = padronizar_data(campos[4]) if len(campos) > 4 else ''
        ano = int(campos[5]) if len(campos) > 5 and campos[5].isdigit() else 0
        aba = campos[7].strip() if len(campos) > 7 else 'Folha1'
        
        # Calcula número de parcelas
        num_parcelas = len(parcelas_adicionadas.split('|')) if '|' in parcelas_adicionadas else 1
        
        return {
            'contribuinte': contribuinte,
            'valor_parcelas': valor_parcelas,
            'parcelas_adicionadas': parcelas_adicionadas,
            'parcelas_valores': parcelas_valores,
            'data_entrada': data_entrada,
            'ano': ano,
            'aba': aba,
            'num_parcelas': num_parcelas
        }
    except Exception as e:
        print(f"Erro ao processar linha: {linha[:100]}... - {e}")
        return None

def organizar_csv():
    """Função principal para organizar o arquivo CSV"""
    
    # Ler o arquivo original
    with open('dados-divida-ativa.csv', 'r', encoding='utf-8') as file:
        linhas = file.readlines()
    
    # Remover a primeira linha (cabeçalhos duplicados)
    linhas = linhas[1:]
    
    dados_organizados = []
    linhas_processadas = 0
    linhas_validas = 0
    
    for linha in linhas:
        linha = linha.strip()
        if not linha:
            continue
        
        linhas_processadas += 1
        
        # Pular linhas que são cabeçalhos
        if linha.startswith('DI_CONTRIBUINTE'):
            continue
        
        dados = processar_linha_csv(linha)
        if dados and dados['contribuinte'] and dados['valor_parcelas'] > 0:
            dados_organizados.append(dados)
            linhas_validas += 1
    
    # Remover duplicatas
    dados_unicos = []
    contribuintes_vistos = set()
    
    for dado in dados_organizados:
        chave = f"{dado['contribuinte']}_{dado['valor_parcelas']}_{dado['data_entrada']}"
        if chave not in contribuintes_vistos:
            dados_unicos.append(dado)
            contribuintes_vistos.add(chave)
    
    # Ordenar por contribuinte, ano e data
    dados_unicos.sort(key=lambda x: (x['contribuinte'], x['ano'], x['data_entrada']))
    
    # Salvar arquivo organizado
    with open('dados-divida-ativa-organizado.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=[
            'contribuinte', 'valor_parcelas', 'parcelas_adicionadas', 
            'parcelas_valores', 'data_entrada', 'ano', 'aba', 'num_parcelas'
        ])
        
        writer.writeheader()
        writer.writerows(dados_unicos)
    
    # Criar estatísticas
    total_valor = sum(d['valor_parcelas'] for d in dados_unicos)
    anos_unicos = sorted(set(d['ano'] for d in dados_unicos if d['ano'] > 0))
    
    print(f"=== RELATÓRIO DE PROCESSAMENTO ===")
    print(f"Linhas processadas: {linhas_processadas}")
    print(f"Linhas válidas: {linhas_validas}")
    print(f"Registros únicos: {len(dados_unicos)}")
    print(f"Total em dívida: R$ {total_valor:,.2f}")
    print(f"Anos encontrados: {anos_unicos}")
    
    print(f"\n=== DISTRIBUIÇÃO POR ANO ===")
    for ano in anos_unicos:
        dados_ano = [d for d in dados_unicos if d['ano'] == ano]
        total_ano = sum(d['valor_parcelas'] for d in dados_ano)
        print(f"Ano {ano}: {len(dados_ano)} registros - R$ {total_ano:,.2f}")
    
    print(f"\n=== TOP 10 MAIORES DÍVIDAS ===")
    top_10 = sorted(dados_unicos, key=lambda x: x['valor_parcelas'], reverse=True)[:10]
    for i, dado in enumerate(top_10, 1):
        print(f"{i}. {dado['contribuinte']} - R$ {dado['valor_parcelas']:,.2f}")
    
    return dados_unicos

if __name__ == "__main__":
    dados = organizar_csv()
    print(f"\nArquivo 'dados-divida-ativa-organizado.csv' criado com sucesso!")
