export const APP_CONFIG = {
  name: 'Dívida Ativa',
  version: '1.0.0',
  description: 'Sistema de gestão de dívida ativa'
};

export const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'liquidado', label: 'Liquidado' },
  { value: 'cancelado', label: 'Cancelado' }
];

export const TIPO_PROCESSO_OPTIONS = [
  { value: 'execucao', label: 'Execução' },
  { value: 'cobranca', label: 'Cobrança' },
  { value: 'outros', label: 'Outros' }
];
