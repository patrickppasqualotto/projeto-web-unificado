const express = require('express');
const jwt = require('jsonwebtoken');
const { verifyCredentials } = require('../lib/authService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_super_segura_utfpr';

/**
 * POST /auth/login
 * API endpoint que retorna JWT (para mobile/Expo)
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

  try {
    const usuario = await verifyCredentials(email, password);
    if (!usuario) return res.status(401).json({ error: 'Credenciais inválidas' });

    const payload = { 
      id_usuario: usuario.id, 
      email: usuario.email, 
      nome: usuario.name, 
      id_perfil: usuario.id_perfil,
      id_curso: usuario.id_curso,
      role: usuario.role
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

    res.json({
      token,
      user: {
        id: usuario.id,
        id_usuario: usuario.id,
        name: usuario.name,
        nome: usuario.name,
        email: usuario.email,
        id_perfil: usuario.id_perfil,
        id_curso: usuario.id_curso,
        role: usuario.role,
        profileName: usuario.profileName
      }
    });
  } catch (err) {
    console.error('Erro no /auth/login:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

module.exports = router;
