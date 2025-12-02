const { testarConexao } = require('./Configuracao/database');

(async () => {
  await testarConexao();
  // aqui você pode inicializar modelos / iniciar servidor após conexão
})();