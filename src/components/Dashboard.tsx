import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  AccountBalance, 
  TrendingUp, 
  Warning, 
  Assessment,
  Refresh,
  Search
} from '@mui/icons-material';
import { CSVService, DashboardData } from '../services/csvService';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await CSVService.loadDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError('Erro ao carregar dados. Verifique se o arquivo CSV está disponível.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" action={
          <IconButton color="inherit" size="small" onClick={loadData}>
            <Refresh />
          </IconButton>
        }>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!data) return null;

  const metrics = CSVService.calculateMetrics(data);
  const topDividas = CSVService.getTopDividas(data, 10);
  const resumoPorAno = CSVService.getResumoPorAno(data);
  const ultimosPagamentos = CSVService.getUltimosPagamentos(data, 25);
  const todasDividas = CSVService.getAllDividas(data);

  // Filtra todas as dívidas baseado no termo de busca
  const todasDividasFiltradas = todasDividas
    .filter(d => 
      searchTerm === '' || 
      d.contribuinte.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.valor_atual.toString().includes(searchTerm)
    )
    .sort((a, b) => b.valor_atual - a.valor_atual);

  console.log('Todas as dívidas:', todasDividas.length);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
             {/* Cabeçalho com imagem personalizada */}
       <Box sx={{ 
         position: 'relative',
         borderBottom: '2px solid #ddd',
         background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
         padding: '20px'
       }}>
         {/* Logo e título */}
         <Box sx={{ 
           display: 'flex', 
           alignItems: 'center', 
           justifyContent: 'space-between',
           maxWidth: '1200px',
           margin: '0 auto'
         }}>
           {/* Logo */}
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
             <img 
               src="/logo.svg" 
               alt="Logo Dívida Ativa" 
               style={{ 
                 height: '50px',
                 filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
               }} 
               onError={(e) => {
                 // Fallback se o logo não existir
                 e.currentTarget.style.display = 'none';
               }}
             />
             <Box>
               <Typography 
                 variant="h4" 
                 sx={{ 
                   color: 'white', 
                   fontWeight: 'bold',
                   textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                 }}
               >
                 Dívida Ativa
               </Typography>
               <Typography 
                 variant="subtitle1" 
                 sx={{ 
                   color: '#e3f2fd',
                   fontWeight: 300
                 }}
               >
                 Dashboard de Controle
               </Typography>
             </Box>
           </Box>
           
           {/* Barra de ações */}
           <Box sx={{ 
             background: 'rgba(255,255,255,0.1)',
             borderRadius: '8px',
             padding: '8px',
             backdropFilter: 'blur(10px)'
           }}>
             <IconButton 
               onClick={loadData}
               sx={{ 
                 color: 'white',
                 '&:hover': { background: 'rgba(255,255,255,0.2)' }
               }}
             >
               <Refresh />
             </IconButton>
           </Box>
         </Box>
       </Box>

             {/* Conteúdo principal - Ocupa toda a tela restante */}
                        <Box component="main" sx={{ 
           flexGrow: 1, 
           p: { xs: 1, sm: 2, md: 3 },
           overflow: 'auto',
           height: 'calc(100vh - 100px)' // Ajustado para a nova altura do cabeçalho com logo
         }}>
        {/* Cards de métricas - Responsivos */}
        <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant={isMobile ? "body2" : "h6"}>
                      Total em Dívida
                    </Typography>
                    <Typography variant={isMobile ? "h6" : "h4"} component="div">
                      R$ {metrics.totalDivida.toLocaleString('pt-BR')}
                    </Typography>
                  </Box>
                  <AccountBalance sx={{ fontSize: isMobile ? 30 : 40, color: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant={isMobile ? "body2" : "h6"}>
                      Processos Ativos
                    </Typography>
                    <Typography variant={isMobile ? "h6" : "h4"} component="div">
                      {metrics.processosAtivos}
                    </Typography>
                  </Box>
                  <Warning sx={{ fontSize: isMobile ? 30 : 40, color: 'error.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant={isMobile ? "body2" : "h6"}>
                      Valor Recuperado
                    </Typography>
                    <Typography variant={isMobile ? "h6" : "h4"} component="div">
                      R$ {metrics.valorRecuperado.toLocaleString('pt-BR')}
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: isMobile ? 30 : 40, color: 'success.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant={isMobile ? "body2" : "h6"}>
                      Contribuintes
                    </Typography>
                    <Typography variant={isMobile ? "h6" : "h4"} component="div">
                      {metrics.totalContribuintes}
                    </Typography>
                  </Box>
                  <Assessment sx={{ fontSize: isMobile ? 30 : 40, color: 'info.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

                 {/* Layout principal com Top 10 e Últimos Pagamentos lado a lado */}
         <Grid container spacing={2} sx={{ mb: 2 }} alignItems="stretch">
          {/* Tabela Top 10 */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2 }}>
                                 <Typography variant="h6" gutterBottom>
                   Top 10 Maiores Dívidas
                 </Typography>
                <TableContainer component={Paper}>
                  <Table size={isMobile ? "small" : "medium"}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Contribuinte</TableCell>
                        <TableCell>Valor Parcelas</TableCell>
                        <TableCell>Parcelas</TableCell>
                        <TableCell>Data Entrada</TableCell>
                        <TableCell>Ano</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topDividas.map((divida) => (
                        <TableRow key={divida.id_divida} hover>
                          <TableCell>
                            <Typography variant={isMobile ? "body2" : "body1"}>
                              {divida.contribuinte}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              R$ {divida.valor_atual.toLocaleString('pt-BR')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={divida.totalParcelas.toString()} 
                              size={isMobile ? "small" : "medium"}
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>
                            {divida.data_inclusao ? new Date(divida.data_inclusao).toLocaleDateString('pt-BR') : 'N/A'}
                          </TableCell>
                          <TableCell>
                            {new Date(divida.data_inclusao).getFullYear()}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={divida.status} 
                              size={isMobile ? "small" : "medium"}
                              color={divida.status === 'ATIVA' ? 'error' : 'success'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Últimos Pagamentos */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom>
                  Últimos Pagamentos ({ultimosPagamentos.length})
                </Typography>
                <TableContainer component={Paper} sx={{ flexGrow: 1, maxHeight: 'none' }}>
                  <Table size="small" sx={{ '& .MuiTableCell-root': { padding: '4px 8px', fontSize: '0.75rem' } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ width: '30%', fontWeight: 'bold' }}>Valor</TableCell>
                        <TableCell sx={{ width: '50%', fontWeight: 'bold' }}>Contribuinte</TableCell>
                        <TableCell sx={{ width: '20%', fontWeight: 'bold' }}>Data</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ultimosPagamentos.map((pagamento) => (
                        <TableRow key={pagamento.id_pagamento} hover>
                          <TableCell sx={{ fontWeight: 'bold', color: 'success.main' }}>
                            R$ {pagamento.valor_pago.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" noWrap sx={{ maxWidth: '150px', display: 'block' }}>
                              {pagamento.contribuinte}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(pagamento.data_pagamento).toLocaleDateString('pt-BR')}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Resumo por ano em linha separada */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Resumo por Ano
                </Typography>
                <Grid container spacing={2}>
                  {resumoPorAno.map((resumo) => (
                    <Grid item xs={12} sm={6} md={3} key={resumo.ano}>
                      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="subtitle1" color="primary" fontWeight="bold">
                          Ano {resumo.ano}
                        </Typography>
                        <Typography variant="body2">
                          Quantidade: {resumo.quantidade} contribuintes
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          Total: R$ {resumo.total.toLocaleString('pt-BR')}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

                          {/* Nova seção: Todas as Dívidas */}
         <Card sx={{ mt: 2, height: 600 }}>
           <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Todas as Dívidas ({todasDividasFiltradas.length} registros)
              </Typography>
              <TextField
                size="small"
                placeholder="Buscar por nome ou valor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
                         <TableContainer component={Paper} sx={{ flexGrow: 1, overflow: 'auto' }}>
              <Table stickyHeader size={isMobile ? "small" : "medium"} sx={{ '& .MuiTableCell-root': { padding: '8px 4px' } }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '35%' }}>Contribuinte</TableCell>
                    <TableCell sx={{ width: '25%' }}>Valor Parcelas</TableCell>
                    <TableCell sx={{ width: '15%' }}>Data Entrada</TableCell>
                    <TableCell sx={{ width: '10%' }}>Ano</TableCell>
                    <TableCell sx={{ width: '15%' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todasDividasFiltradas.map((divida) => (
                    <TableRow key={divida.id_divida} hover>
                      <TableCell sx={{ width: '35%' }}>
                        <Typography variant={isMobile ? "body2" : "body1"}>
                          {divida.contribuinte}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: '25%' }}>
                        <Typography variant="body2" fontWeight="bold">
                          R$ {divida.valor_atual.toLocaleString('pt-BR')}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ width: '15%' }}>
                        {divida.data_inclusao ? new Date(divida.data_inclusao).toLocaleDateString('pt-BR') : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ width: '10%' }}>
                        {new Date(divida.data_inclusao).getFullYear()}
                      </TableCell>
                      <TableCell sx={{ width: '15%' }}>
                        <Chip 
                          label={divida.status} 
                          size={isMobile ? "small" : "medium"}
                          color={divida.status === 'ATIVA' ? 'error' : 'success'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
