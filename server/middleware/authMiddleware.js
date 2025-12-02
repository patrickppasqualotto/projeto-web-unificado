const jwt = require('jsonwebtoken');

/**
 * Middleware para proteger rotas MVC (requer sessão)
 */
function requireSession(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/web/login?next=' + encodeURIComponent(req.originalUrl));
}

/**
 * Middleware para proteger rotas API (requer JWT)
 */
function requireJwt(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = auth.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_super_segura_utfpr';
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Anexar informações do token
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token expirado ou inválido' });
  }
}

/**
 * Middleware para verificar se usuário é administrador (MVC)
 * Requer que requireSession seja chamado antes
 */
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect('/web/login?next=' + encodeURIComponent(req.originalUrl));
  }

  if (req.session.user.id_perfil !== 2) {
    return res.status(403).render('error', {
      message: 'Acesso negado. Apenas administradores podem acessar esta página.',
      user: req.session.user
    });
  }

  next();
}

/**
 * Middleware para verificar se usuário é administrador (API/JWT)
 * Requer que requireJwt seja chamado antes
 */
function requireAdminJwt(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  if (req.user.id_perfil !== 2) {
    return res.status(403).json({ 
      error: 'Acesso negado. Apenas administradores podem realizar esta operação.' 
    });
  }

  next();
}

module.exports = { requireSession, requireJwt, requireAdmin, requireAdminJwt };
