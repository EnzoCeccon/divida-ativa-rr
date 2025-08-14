import pandas as pd
import re
from datetime import datetime
import csv

def limpar_e_organizar_csv():
    """
    Função para limpar e organizar o arquivo CSV de dívida ativa
    """
    
    # Ler o arquivo original
    with open('dados-divida-ativa.csv', 'r', encoding='utf-8') as file:
        linhas = file.readlines()
    
    # Remover a primeira linha que contém cabeçalhos duplicados
    linhas = linhas[1:]
    
    dados_organizados = []
    
    for linha in linhas:
        linha = linha.strip()
        if not linha:  # Pular linhas vazias
            continue
            
        # Verificar se a linha contém dados válidos
        if ',' in linha and not linha.startswith('DI_CONTRIBUINTE'):
            # Dividir a linha por vírgulas
            campos = linha.split(',')
            
            # Remover campos vazios no final
            campos = [campo.strip() for campo in campos if campo.strip()]
            
            # Verificar se temos pelo menos 5 campos (mínimo necessário)
            if len(campos) >= 5:
                try:
                    # Extrair informações básicas
                    contribuinte = campos[0]
                    
                    # Tentar extrair valor das parcelas
                    valor_parcelas = campos[1] if len(campos) > 1 else ''
                    
                    # Tentar extrair número de parcelas
                    parcelas_adicionadas = campos[2] if len(campos) > 2 else ''
                    
                    # Tentar extrair valores das parcelas
                    parcelas_valores = campos[3] if len(campos) > 3 else ''
                    
                    # Tentar extrair data de entrada
                    entrada = campos[4] if len(campos) > 4 else ''
                    
                    # Tentar extrair ano
                    ano = campos[5] if len(campos) > 5 else ''
                    
                    # Tentar extrair ano duplicado (se existir)
                    ano_duplicado = campos[6] if len(campos) > 6 else ''
                    
                    # Tentar extrair aba/folha
                    aba = campos[7] if len(campos) > 7 else ''
                    
                    # Limpar e padronizar valores
                    contribuinte = contribuinte.strip()
                    
                    # Converter valor para número se possível
                    try:
                        valor_parcelas = float(valor_parcelas.replace('R$', '').replace('.', '').replace(',', '.').strip())
                    except:
                        valor_parcelas = 0.0
                    
                    # Padronizar data
                    if entrada:
                        try:
                            # Tentar diferentes formatos de data
                            if '/' in entrada:
                                if len(entrada.split('/')) == 3:
                                    entrada = datetime.strptime(entrada, '%m/%d/%Y').strftime('%Y-%m-%d')
                                else:
                                    entrada = datetime.strptime(entrada, '%d/%m/%Y').strftime('%Y-%m-%d')
                            elif 'T' in entrada or ' ' in entrada:
                                entrada = entrada.split(' ')[0] if ' ' in entrada else entrada.split('T')[0]
                        except:
                            entrada = ''
                    
                    # Converter ano para inteiro se possível
                    try:
                        ano = int(ano) if ano else 0
                    except:
                        ano = 0
                    
                    # Adicionar à lista de dados organizados
                    dados_organizados.append({
                        'contribuinte': contribuinte,
                        'valor_parcelas': valor_parcelas,
                        'parcelas_adicionadas': parcelas_adicionadas,
                        'parcelas_valores': parcelas_valores,
                        'data_entrada': entrada,
                        'ano': ano,
                        'aba': aba
                    })
                    
                except Exception as e:
                    print(f"Erro ao processar linha: {linha[:100]}... - {e}")
                    continue
    
    # Criar DataFrame
    df = pd.DataFrame(dados_organizados)
    
    # Remover duplicatas
    df = df.drop_duplicates()
    
    # Ordenar por contribuinte e ano
    df = df.sort_values(['contribuinte', 'ano', 'data_entrada'])
    
    # Salvar arquivo organizado
    df.to_csv('dados-divida-ativa-organizado.csv', index=False, encoding='utf-8')
    
    # Salvar também em formato Excel para melhor visualização
    df.to_excel('dados-divida-ativa-organizado.xlsx', index=False)
    
    print(f"Arquivo organizado com sucesso!")
    print(f"Total de registros: {len(df)}")
    print(f"Colunas: {list(df.columns)}")
    print(f"Anos encontrados: {sorted(df['ano'].unique())}")
    
    return df

def criar_estatisticas(df):
    """
    Criar estatísticas dos dados organizados
    """
    print("\n=== ESTATÍSTICAS DOS DADOS ===")
    print(f"Total de contribuintes únicos: {df['contribuinte'].nunique()}")
    print(f"Valor total das dívidas: R$ {df['valor_parcelas'].sum():,.2f}")
    print(f"Valor médio por dívida: R$ {df['valor_parcelas'].mean():,.2f}")
    print(f"Maior dívida: R$ {df['valor_parcelas'].max():,.2f}")
    print(f"Menor dívida: R$ {df['valor_parcelas'].min():,.2f}")
    
    print("\n=== DISTRIBUIÇÃO POR ANO ===")
    for ano in sorted(df['ano'].unique()):
        if ano > 0:
            dados_ano = df[df['ano'] == ano]
            print(f"Ano {ano}: {len(dados_ano)} registros - R$ {dados_ano['valor_parcelas'].sum():,.2f}")

if __name__ == "__main__":
    # Organizar os dados
    df_organizado = limpar_e_organizar_csv()
    
    # Criar estatísticas
    criar_estatisticas(df_organizado)
