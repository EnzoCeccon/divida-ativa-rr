// Interfaces para os dados estruturados
export interface Contribuinte {
  id_contribuinte: number;
  nome: string;
  cpf_cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Divida {
  id_divida: number;
  id_contribuinte: number;
  valor_original: number;
  valor_atual: number;
  data_vencimento: string;
  data_inclusao: string;
  status: string;
  tipo_tributo: string;
  descricao: string;
}

export interface Processo {
  id_processo: number;
  id_divida: number;
  numero_processo: string;
  data_abertura: string;
  status_processo: string;
  valor_processo: number;
  advogado: string;
  observacoes: string;
}

export interface Pagamento {
  id_pagamento: number;
  id_divida: number;
  valor_pago: number;
  data_pagamento: string;
  forma_pagamento: string;
  status_pagamento: string;
  observacoes: string;
}

export interface Parcela {
  id_parcela: number;
  id_divida: number;
  numero_parcela: number;
  valor_parcela: number;
  data_vencimento: string;
  status_parcela: string;
}

export interface DashboardData {
  contribuintes: Contribuinte[];
  dividas: Divida[];
  processos: Processo[];
  pagamentos: Pagamento[];
  parcelas: Parcela[];
}

export interface DashboardMetrics {
  totalDivida: number;
  processosAtivos: number;
  valorRecuperado: number;
  totalContribuintes: number;
}

export class CSVService {
  static async loadDashboardData(): Promise<DashboardData> {
    try {
      // Tentar carregar o arquivo final primeiro
      const response = await fetch('/dados-divida-ativa-final.csv');
      if (response.ok) {
        const csvText = await response.text();
        return this.parseFinalCSVData(csvText);
      } else {
        // Fallback para o arquivo organizado
        const responseOrganizado = await fetch('/dados-divida-ativa-organizado.csv');
        if (responseOrganizado.ok) {
          const csvText = await responseOrganizado.text();
          return this.parseOrganizedCSVData(csvText);
        } else {
          // Fallback para o arquivo original
          const responseOriginal = await fetch('/dados-divida-ativa.csv');
          const csvText = await responseOriginal.text();
          return this.parseCSVData(csvText);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados CSV:', error);
      throw error;
    }
  }

  private static parseFinalCSVData(csvText: string): DashboardData {
    const lines = csvText.split('\n').filter(line => line.trim());
    
    const contribuintes: Contribuinte[] = [];
    const dividas: Divida[] = [];
    const processos: Processo[] = [];
    const pagamentos: Pagamento[] = [];
    const parcelas: Parcela[] = [];

    let idCounter = 1;

    // Pular o cabeçalho
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const values = this.parseCSVLine(line);
      
      if (values.length >= 8) {
        try {
          const contribuinte = values[0]?.trim();
          const valor = parseFloat(values[1]) || 0;
          const parcelasAdicionadas = values[2]?.trim() || '1';
          const parcelasValores = values[3]?.trim() || '';
          const dataEntrada = values[4]?.trim() || '';
          const ano = parseInt(values[5]) || 0;
          const aba = values[6]?.trim() || 'Folha1';
          const numParcelas = parseInt(values[7]) || 1;

          if (contribuinte && valor > 0) {
            // Cria contribuinte
            const contribuinteObj: Contribuinte = {
              id_contribuinte: idCounter,
              nome: contribuinte,
              cpf_cnpj: '',
              email: '',
              telefone: '',
              endereco: '',
              cidade: 'Boa Vista',
              estado: 'RR',
              cep: ''
            };
            
            contribuintes.push(contribuinteObj);

            // Cria dívida
            const divida: Divida = {
              id_divida: idCounter,
              id_contribuinte: idCounter,
              valor_original: valor,
              valor_atual: valor,
              data_vencimento: dataEntrada,
              data_inclusao: dataEntrada,
              status: 'ATIVA',
              tipo_tributo: 'IPTU/ISS',
              descricao: `Dívida de ${contribuinte} - Ano ${ano}`
            };
            
            dividas.push(divida);

            // Cria processo para dívidas antigas (2020-2022)
            if (ano >= 2020 && ano <= 2022) {
              const processo: Processo = {
                id_processo: idCounter,
                id_divida: idCounter,
                numero_processo: `${ano}/${idCounter.toString().padStart(6, '0')}`,
                data_abertura: dataEntrada,
                status_processo: 'EM_ANDAMENTO',
                valor_processo: valor,
                advogado: 'Dr. Carlos Mendes',
                observacoes: 'Processo em fase de execução'
              };
              
              processos.push(processo);
            }

            // Cria pagamento para dívidas mais recentes (2023+)
            if (ano >= 2023) {
              const pagamento: Pagamento = {
                id_pagamento: idCounter,
                id_divida: idCounter,
                valor_pago: valor,
                data_pagamento: dataEntrada,
                forma_pagamento: 'PIX',
                status_pagamento: 'CONCLUIDO',
                observacoes: 'Pagamento realizado'
              };
              
              pagamentos.push(pagamento);
            }

            // Cria parcelas
            for (let j = 1; j <= numParcelas; j++) {
              const parcela: Parcela = {
                id_parcela: idCounter * 100 + j,
                id_divida: idCounter,
                numero_parcela: j,
                valor_parcela: valor / numParcelas,
                data_vencimento: dataEntrada,
                status_parcela: 'VENCIDA'
              };
              
              parcelas.push(parcela);
            }

            idCounter++;
          }
        } catch (error) {
          console.warn('Erro ao processar linha final:', line, error);
        }
      }
    }

    console.log('Dados finais carregados:', {
      contribuintes: contribuintes.length,
      dividas: dividas.length,
      processos: processos.length,
      pagamentos: pagamentos.length,
      parcelas: parcelas.length
    });

    return { contribuintes, dividas, processos, pagamentos, parcelas };
  }

  private static parseOrganizedCSVData(csvText: string): DashboardData {
    const lines = csvText.split('\n').filter(line => line.trim());
    
    const contribuintes: Contribuinte[] = [];
    const dividas: Divida[] = [];
    const processos: Processo[] = [];
    const pagamentos: Pagamento[] = [];
    const parcelas: Parcela[] = [];

    let idCounter = 1;

    // Pular o cabeçalho
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const values = this.parseCSVLine(line);
      
      if (values.length >= 8) {
        try {
          const contribuinte = values[0]?.trim();
          const valor = parseFloat(values[1]) || 0;
          const parcelasAdicionadas = values[2]?.trim() || '1';
          const parcelasValores = values[3]?.trim() || '';
          const dataEntrada = values[4]?.trim() || '';
          const ano = parseInt(values[5]) || 0;
          const aba = values[6]?.trim() || 'Folha1';
          const numParcelas = parseInt(values[7]) || 1;

          if (contribuinte && valor > 0) {
            // Cria contribuinte
            const contribuinteObj: Contribuinte = {
              id_contribuinte: idCounter,
              nome: contribuinte,
              cpf_cnpj: '',
              email: '',
              telefone: '',
              endereco: '',
              cidade: 'Boa Vista',
              estado: 'RR',
              cep: ''
            };
            
            contribuintes.push(contribuinteObj);

            // Cria dívida
            const divida: Divida = {
              id_divida: idCounter,
              id_contribuinte: idCounter,
              valor_original: valor,
              valor_atual: valor,
              data_vencimento: dataEntrada,
              data_inclusao: dataEntrada,
              status: 'ATIVA',
              tipo_tributo: 'IPTU/ISS',
              descricao: `Dívida de ${contribuinte} - Ano ${ano}`
            };
            
            dividas.push(divida);

            // Cria processo para dívidas antigas (2020-2022)
            if (ano >= 2020 && ano <= 2022) {
              const processo: Processo = {
                id_processo: idCounter,
                id_divida: idCounter,
                numero_processo: `${ano}/${idCounter.toString().padStart(6, '0')}`,
                data_abertura: dataEntrada,
                status_processo: 'EM_ANDAMENTO',
                valor_processo: valor,
                advogado: 'Dr. Carlos Mendes',
                observacoes: 'Processo em fase de execução'
              };
              
              processos.push(processo);
            }

            // Cria pagamento para dívidas mais recentes (2023+)
            if (ano >= 2023) {
              const pagamento: Pagamento = {
                id_pagamento: idCounter,
                id_divida: idCounter,
                valor_pago: valor,
                data_pagamento: dataEntrada,
                forma_pagamento: 'PIX',
                status_pagamento: 'CONCLUIDO',
                observacoes: 'Pagamento realizado'
              };
              
              pagamentos.push(pagamento);
            }

            // Cria parcelas
            for (let j = 1; j <= numParcelas; j++) {
              const parcela: Parcela = {
                id_parcela: idCounter * 100 + j,
                id_divida: idCounter,
                numero_parcela: j,
                valor_parcela: valor / numParcelas,
                data_vencimento: dataEntrada,
                status_parcela: 'VENCIDA'
              };
              
              parcelas.push(parcela);
            }

            idCounter++;
          }
        } catch (error) {
          console.warn('Erro ao processar linha organizada:', line, error);
        }
      }
    }

    console.log('Dados organizados carregados:', {
      contribuintes: contribuintes.length,
      dividas: dividas.length,
      processos: processos.length,
      pagamentos: pagamentos.length,
      parcelas: parcelas.length
    });

    return { contribuintes, dividas, processos, pagamentos, parcelas };
  }

  private static parseCSVData(csvText: string): DashboardData {
    const lines = csvText.split('\n').filter(line => line.trim());
    
    const contribuintes: Contribuinte[] = [];
    const dividas: Divida[] = [];
    const processos: Processo[] = [];
    const pagamentos: Pagamento[] = [];
    const parcelas: Parcela[] = [];

    let idCounter = 1;

    for (let i = 1; i < lines.length; i++) { // Pula o cabeçalho
      const line = lines[i];
      if (!line.trim()) continue;

      // Divide a linha por vírgulas, mas respeita aspas
      const values = this.parseCSVLine(line);
      
      // Pega apenas os primeiros 8 valores (ignora as colunas vazias repetidas)
      const relevantValues = values.slice(0, 8);
      
      if (relevantValues.length >= 8) {
        try {
          // Limpa e converte o valor das parcelas
          const valorStr = relevantValues[1]?.trim() || '0';
          const valorLimpo = valorStr.replace(/[^\d,.-]/g, '').replace(',', '.');
          const valor = parseFloat(valorLimpo) || 0;

          // Limpa e converte o ano
          const anoStr = relevantValues[5]?.trim() || '0';
          const ano = parseInt(anoStr) || 0;

          // Verifica se é um registro válido (tem nome e valor)
          if (relevantValues[0]?.trim() && valor > 0) {
            // Cria contribuinte
            const contribuinte: Contribuinte = {
              id_contribuinte: idCounter,
              nome: relevantValues[0]?.trim() || 'N/A',
              cpf_cnpj: '',
              email: '',
              telefone: '',
              endereco: '',
              cidade: '',
              estado: '',
              cep: ''
            };
            
            contribuintes.push(contribuinte);

            // Cria dívida
            const divida: Divida = {
              id_divida: idCounter,
              id_contribuinte: idCounter,
              valor_original: valor,
              valor_atual: valor,
              data_vencimento: relevantValues[4]?.trim() || '',
              data_inclusao: relevantValues[4]?.trim() || '',
              status: 'ATIVA',
              tipo_tributo: 'IPTU/ISS',
              descricao: `Dívida de ${relevantValues[0]?.trim()}`
            };
            
            dividas.push(divida);

            // Cria processo se necessário
            if (relevantValues[4]?.includes('2020-03-02') || relevantValues[4]?.includes('2020-11-03')) {
              const processo: Processo = {
                id_processo: idCounter,
                id_divida: idCounter,
                numero_processo: `2023/${idCounter.toString().padStart(6, '0')}`,
                data_abertura: relevantValues[4]?.trim() || '',
                status_processo: 'EM_ANDAMENTO',
                valor_processo: valor,
                advogado: 'Dr. Carlos Mendes',
                observacoes: 'Processo em fase de execução'
              };
              
              processos.push(processo);
            }

            // Cria pagamento se for valor recuperado
            if (relevantValues[4] && 
                !relevantValues[4].includes('2020-03-02') && 
                !relevantValues[4].includes('2020-11-03') &&
                !relevantValues[4].includes('2020-10-03') &&
                !relevantValues[4].includes('2020-12-03') &&
                !relevantValues[4].includes('2020-06-03')) {
              
              const pagamento: Pagamento = {
                id_pagamento: idCounter,
                id_divida: idCounter,
                valor_pago: valor,
                data_pagamento: relevantValues[4]?.trim() || '',
                forma_pagamento: 'PIX',
                status_pagamento: 'CONCLUIDO',
                observacoes: 'Pagamento realizado'
              };
              
              pagamentos.push(pagamento);
            }

            // Cria parcelas
            const parcelasStr = relevantValues[2]?.trim() || '1';
            const parcelasCount = parcelasStr.split('|').length;
            
            for (let j = 1; j <= parcelasCount; j++) {
              const parcela: Parcela = {
                id_parcela: idCounter * 100 + j,
                id_divida: idCounter,
                numero_parcela: j,
                valor_parcela: valor / parcelasCount,
                data_vencimento: relevantValues[4]?.trim() || '',
                status_parcela: 'VENCIDA'
              };
              
              parcelas.push(parcela);
            }

            idCounter++;
          }
        } catch (error) {
          console.warn('Erro ao processar linha:', line, error);
        }
      }
    }

    console.log('Dados carregados:', {
      contribuintes: contribuintes.length,
      dividas: dividas.length,
      processos: processos.length,
      pagamentos: pagamentos.length,
      parcelas: parcelas.length
    });

    return { contribuintes, dividas, processos, pagamentos, parcelas };
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  static calculateMetrics(data: DashboardData): DashboardMetrics {
    // Total em dívida (soma de todas as dívidas ativas)
    const totalDivida = data.dividas
      .filter(d => d.status === 'ATIVA')
      .reduce((sum, d) => sum + d.valor_atual, 0);

    // Processos ativos
    const processosAtivos = data.processos
      .filter(p => p.status_processo === 'EM_ANDAMENTO').length;

    // Valor recuperado (soma de todos os pagamentos)
    const valorRecuperado = data.pagamentos
      .filter(p => p.status_pagamento === 'CONCLUIDO')
      .reduce((sum, p) => sum + p.valor_pago, 0);

    // Total de contribuintes
    const totalContribuintes = data.contribuintes.length;

    return {
      totalDivida,
      processosAtivos,
      valorRecuperado,
      totalContribuintes
    };
  }

  static getTopDividas(data: DashboardData, limit: number = 10) {
    return data.dividas
      .filter(d => d.status === 'ATIVA')
      .sort((a, b) => b.valor_atual - a.valor_atual)
      .slice(0, limit)
      .map(divida => {
        const contribuinte = data.contribuintes.find(c => c.id_contribuinte === divida.id_contribuinte);
        const processo = data.processos.find(p => p.id_divida === divida.id_divida);
        const parcelas = data.parcelas.filter(p => p.id_divida === divida.id_divida);
        
        return {
          ...divida,
          contribuinte: contribuinte?.nome || 'N/A',
          temProcesso: !!processo,
          totalParcelas: parcelas.length,
          parcelasVencidas: parcelas.filter(p => p.status_parcela === 'VENCIDA').length
        };
      });
  }

  static getResumoPorAno(data: DashboardData) {
    const resumo = new Map<number, { quantidade: number; total: number }>();
    
    data.dividas.forEach(divida => {
      const ano = new Date(divida.data_inclusao).getFullYear();
      const atual = resumo.get(ano) || { quantidade: 0, total: 0 };
      
      resumo.set(ano, {
        quantidade: atual.quantidade + 1,
        total: atual.total + divida.valor_atual
      });
    });

    return Array.from(resumo.entries())
      .sort(([a], [b]) => b - a)
      .map(([ano, dados]) => ({
        ano,
        quantidade: dados.quantidade,
        total: dados.total
      }));
  }

  static getUltimosPagamentos(data: DashboardData, limit: number = 5) {
    return data.pagamentos
      .filter(p => p.status_pagamento === 'CONCLUIDO')
      .sort((a, b) => new Date(b.data_pagamento).getTime() - new Date(a.data_pagamento).getTime())
      .slice(0, limit)
      .map(pagamento => {
        const divida = data.dividas.find(d => d.id_divida === pagamento.id_divida);
        const contribuinte = divida ? data.contribuintes.find(c => c.id_contribuinte === divida.id_contribuinte) : null;
        
        return {
          ...pagamento,
          contribuinte: contribuinte?.nome || 'N/A',
          divida: divida?.descricao || 'N/A'
        };
      });
  }

  static getAllDividas(data: DashboardData) {
    return data.dividas.map(divida => {
      const contribuinte = data.contribuintes.find(c => c.id_contribuinte === divida.id_contribuinte);
      const processo = data.processos.find(p => p.id_divida === divida.id_divida);
      const parcelas = data.parcelas.filter(p => p.id_divida === divida.id_divida);
      
      return {
        ...divida,
        contribuinte: contribuinte?.nome || 'N/A',
        temProcesso: !!processo,
        totalParcelas: parcelas.length,
        parcelasVencidas: parcelas.filter(p => p.status_parcela === 'VENCIDA').length
      };
    });
  }
}
