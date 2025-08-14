export interface DividaAtiva {
  id: string;
  contribuinte: string;
  cpfCnpj: string;
  valor: number;
  dataVencimento: Date;
  status: 'ativo' | 'liquidado' | 'cancelado';
  processo?: string;
  observacoes?: string;
}

export interface Contribuinte {
  id: string;
  nome: string;
  cpfCnpj: string;
  endereco: string;
  telefone?: string;
  email?: string;
}

export interface Processo {
  id: string;
  numero: string;
  tipo: 'execucao' | 'cobranca' | 'outros';
  status: 'ativo' | 'suspenso' | 'finalizado';
  dataInicio: Date;
  valor: number;
  contribuinteId: string;
}
