const express = require('express');
const { verifyCredentials } = require('../lib/authService');

const router = express.Router();

/**
 * GET /web/login - Renderiza página de login
 */
router.get('/login', (req, res) => {
  const error = req.query.error || null;
  res.render('login', { 
    error, 
    appName: 'Portal Acadêmico UTFPR',
    layout: false // Desabilita layout para esta view
  });
});

/**
 * POST /web/login - Autentica e cria sessão
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render('login', {
      error: 'Email e senha são obrigatórios',
      appName: 'Portal Acadêmico UTFPR',
      layout: false
    });
  }

  try {
    const usuario = await verifyCredentials(email, password);
    if (!usuario) {
      return res.status(401).render('login', {
        error: 'Email ou senha incorretos',
        appName: 'Portal Acadêmico UTFPR',
        layout: false
      });
    }

    // Salvar dados do usuário na sessão (agora com role e profileName)
    req.session.user = {
      id: usuario.id,
      id_usuario: usuario.id,
      nome: usuario.name,
      email: usuario.email,
      id_perfil: usuario.id_perfil,
      id_curso: usuario.id_curso,
      role: usuario.role,
      profileName: usuario.profileName
    };
    
    req.session.save((err) => {
      if (err) {
        return res.status(500).render('login', {
          error: 'Erro ao criar sessão',
          appName: 'Portal Acadêmico UTFPR',
          layout: false
        });
      }
      // Redirecionar admin para notícias (área admin), usuário normal para home
      const nextUrl = usuario.role === 'admin' ? '/noticias' : '/public/home';
      res.redirect(nextUrl);
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).render('login', {
      error: 'Erro interno do servidor',
      appName: 'Portal Acadêmico UTFPR',
      layout: false
    });
  }
});

/**
 * GET /web/logout - Encerra sessão
 */
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao destruir sessão:', err);
    }
    res.redirect('/web/login?message=Logout realizado');
  });
});

module.exports = router;
