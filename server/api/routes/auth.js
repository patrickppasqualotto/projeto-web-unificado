const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Autentica usuário e retorna token JWT
 *     tags: [Autenticação]
 *     description: |
 *       Realiza autenticação com email e senha. Retorna um token JWT válido por 8 horas.
 *       Use este token nos headers das requisições protegidas: `Authorization: Bearer {token}`
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@universidade.edu.br
 *                 description: Email cadastrado no sistema
 *               password:
 *                 type: string
 *                 format: password
 *                 example: admin123
 *                 description: Senha do usuário
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: Token JWT para autenticação (válido por 8 horas)
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: Administrador
 *                     email:
 *                       type: string
 *                       example: admin@universidade.edu.br
 *                     id_perfil:
 *                       type: integer
 *                       example: 2
 *                       description: "1 = Usuário, 2 = Administrador"
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Credenciais inválidas
 *       400:
 *         description: Campos obrigatórios não preenchidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /api/v1/auth/login
router.post('/login', authController.login);

/**
 * @swagger
 * /api/v1/auth/verify:
 *   get:
 *     summary: Valida token JWT
 *     tags: [Autenticação]
 *     description: Verifica se um token JWT é válido e retorna os dados do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: admin@universidade.edu.br
 *                     nome:
 *                       type: string
 *                       example: Administrador
 *                     id_perfil:
 *                       type: integer
 *                       example: 2
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Token inválido
 */
// GET /api/v1/auth/verify
router.get('/verify', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Token não fornecido' });

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta_super_segura_utfpr', (err, user) => {
    if (err) return res.status(401).json({ success: false, error: 'Token inválido' });
    req.user = user;
    authController.verify(req, res);
  });
});

module.exports = router;
