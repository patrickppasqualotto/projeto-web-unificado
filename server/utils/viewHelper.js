const ejs = require('ejs');
const path = require('path');

/**
 * Helper para renderizar views com layout
 * Injeta automaticamente variáveis globais em todas as views
 */
function renderWithLayout(req, res, viewPath, data = {}) {
  const layoutPath = path.resolve(__dirname, '../views/layout.ejs');
  const contentPath = path.resolve(__dirname, '../views', viewPath);
  
  // Variáveis globais disponíveis em todas as views
  const globalData = {
    user: req.session.user || null,
    isAdmin: req.session.user?.id_perfil === 2 || false,
    session: req.session,
    messages: req.session.messages || {},
    ...data
  };
  
  // Limpar mensagens após renderizar
  if (req.session.messages) {
    delete req.session.messages;
  }
  
  // Renderizar o conteúdo da view
  ejs.renderFile(contentPath, globalData, (err, content) => {
    if (err) {
      console.error('Erro ao renderizar view:', err);
      return res.status(500).send('Erro ao renderizar página');
    }
    
    // Renderizar o layout com o conteúdo
    ejs.renderFile(layoutPath, { ...globalData, body: content }, (err, html) => {
      if (err) {
        console.error('Erro ao renderizar layout:', err);
        return res.status(500).send('Erro ao renderizar página');
      }
      
      res.send(html);
    });
  });
}

module.exports = { renderWithLayout };
