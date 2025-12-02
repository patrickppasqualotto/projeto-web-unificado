const express = require('express');
const router = express.Router();
const api = require('../controllers/apiControllers');
const requireJwt = require('../../middleware/authMiddleware').requireJwt;

/**
 * @swagger
 * /api/v1/noticias:
 *   get:
 *     summary: Lista todas as notícias
 *     tags: [Notícias]
 *     description: Retorna lista de todas as notícias publicadas (sem autenticação)
 *     responses:
 *       200:
 *         description: Lista de notícias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_noticia:
 *                         type: integer
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         example: "UTFPR inaugura novo laboratório de inovação"
 *                       subtitulo:
 *                         type: string
 *                         example: "Espaço contará com equipamentos de última geração"
 *                       conteudo:
 *                         type: string
 *                         example: "A Universidade Tecnológica Federal do Paraná inaugurou..."
 *                       id_autor:
 *                         type: integer
 *                         example: 1
 *                       data_publicacao:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-12-01T10:00:00.000Z"
 *                       data_expiracao:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: "2025-12-31T23:59:59.000Z"
 *                       imagem_url:
 *                         type: string
 *                         nullable: true
 *                         example: "https://exemplo.com/imagem.jpg"
 */
router.get('/', api.noticias.list);

/**
 * @swagger
 * /api/v1/noticias/{id}:
 *   get:
 *     summary: Busca notícia por ID
 *     tags: [Notícias]
 *     description: Retorna detalhes de uma notícia específica (sem autenticação)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da notícia
 *         example: 1
 *     responses:
 *       200:
 *         description: Notícia encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_noticia:
 *                       type: integer
 *                       example: 1
 *                     titulo:
 *                       type: string
 *                       example: "UTFPR inaugura novo laboratório"
 *                     subtitulo:
 *                       type: string
 *                       example: "Espaço com equipamentos de última geração"
 *                     conteudo:
 *                       type: string
 *                       example: "A UTFPR inaugurou hoje..."
 *       404:
 *         description: Notícia não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', api.noticias.show);

/**
 * @swagger
 * /api/v1/noticias:
 *   post:
 *     summary: Cria nova notícia
 *     tags: [Notícias]
 *     description: Cria uma nova notícia (requer autenticação de administrador)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - conteudo
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Nova Notícia UTFPR 2025"
 *                 description: Título da notícia (mínimo 5 caracteres)
 *               subtitulo:
 *                 type: string
 *                 example: "Descrição breve da notícia"
 *                 description: Subtítulo opcional
 *               conteudo:
 *                 type: string
 *                 example: "Texto completo da notícia com todos os detalhes sobre o acontecimento na universidade..."
 *                 description: Conteúdo completo da notícia (mínimo 20 caracteres)
 *               imagem_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://exemplo.com/imagem-noticia.jpg"
 *                 description: URL da imagem de capa (opcional)
 *               data_expiracao:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31T23:59:59Z"
 *                 description: Data de expiração da notícia (opcional)
 *     responses:
 *       201:
 *         description: Notícia criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_noticia:
 *                       type: integer
 *                       example: 15
 *                     titulo:
 *                       type: string
 *                       example: "Nova Notícia UTFPR 2025"
 *       401:
 *         description: Não autenticado ou token inválido
 *       400:
 *         description: Dados inválidos
 */
router.post('/', requireJwt, api.noticias.create);

/**
 * @swagger
 * /api/v1/noticias/{id}:
 *   put:
 *     summary: Atualiza notícia existente
 *     tags: [Notícias]
 *     description: Atualiza dados de uma notícia (requer autenticação de administrador)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da notícia a ser atualizada
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Notícia Atualizada - Novo Título"
 *               subtitulo:
 *                 type: string
 *                 example: "Subtítulo atualizado"
 *               conteudo:
 *                 type: string
 *                 example: "Conteúdo atualizado da notícia..."
 *               imagem_url:
 *                 type: string
 *                 example: "https://exemplo.com/nova-imagem.jpg"
 *               data_expiracao:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-01-15T23:59:59Z"
 *     responses:
 *       200:
 *         description: Notícia atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *       404:
 *         description: Notícia não encontrada
 *       401:
 *         description: Não autenticado
 */
router.put('/:id', requireJwt, api.noticias.update);

/**
 * @swagger
 * /api/v1/noticias/{id}:
 *   delete:
 *     summary: Deleta notícia
 *     tags: [Notícias]
 *     description: Remove uma notícia do sistema (requer autenticação de administrador)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da notícia a ser deletada
 *         example: 1
 *     responses:
 *       200:
 *         description: Notícia deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Notícia deletada com sucesso"
 *       404:
 *         description: Notícia não encontrada
 *       401:
 *         description: Não autenticado
 */
router.delete('/:id', requireJwt, api.noticias.delete);

module.exports = router;
