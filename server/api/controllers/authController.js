const jwt = require('jsonwebtoken');
const { Usuario } = require('../../../models');

// POST /api/v1/auth/login (sem criptografia: exige email + password)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validações básicas
    if (!email || !email.trim() || !password) {
      return res.status(400).json({ success: false, error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const usuario = await Usuario.findOne({ where: { email: email.toLowerCase() } });

    if (!usuario) {
      return res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }

    // Comparação direta (sem bcrypt)
    if (usuario.senha !== password) {
      return res.status(401).json({ success: false, error: 'Credenciais inválidas' });
    }

    // Gerar JWT
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        nome: usuario.nome,
        id_perfil: usuario.id_perfil
      },
      process.env.JWT_SECRET || 'chave_secreta_super_segura_utfpr',
      { expiresIn: '8h' }
    );

    // Calcular tempo de expiração
    const expiracaoEm = new Date(Date.now() + 8 * 60 * 60 * 1000);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          nome: usuario.nome,
          email: usuario.email,
          id_perfil: usuario.id_perfil
        },
        expiracaoEm
      }
    });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ success: false, error: 'Erro ao fazer login' });
  }
};

// GET /api/v1/auth/verify (verificar token)
exports.verify = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token válido',
      usuario: req.user
    });
  } catch (err) {
    console.error('Erro ao verificar token:', err);
    res.status(500).json({ success: false, error: 'Erro ao verificar token' });
  }
};
