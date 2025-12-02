const express = require('express');
const router = express.Router();
const api = require('../controllers/apiControllers');
const requireJwt = require('../../middleware/authMiddleware').requireJwt;

/**
 * @swagger
 * /api/v1/categoria-vaga:
 *   get:
 *     summary: Lista todas as categorias de vagas
 *     tags: [Categorias]
 *     description: Retorna categorias (Estágio, Emprego, Freelance, etc)
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
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
 *                       id_categoria:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: "Estágio"
 *                       descricao:
 *                         type: string
 *                         example: "Vagas de estágio obrigatório e não obrigatório"
 */
router.get('/', api.categoriaVaga.list);

/**
 * @swagger
 * /api/v1/categoria-vaga/{id}:
 *   get:
 *     summary: Busca categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/:id', api.categoriaVaga.show);

/**
 * @swagger
 * /api/v1/categoria-vaga:
 *   post:
 *     summary: Cria nova categoria de vaga
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Freelance"
 *               descricao:
 *                 type: string
 *                 example: "Trabalhos temporários e projetos pontuais"
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       401:
 *         description: Não autenticado
 */
router.post('/', requireJwt, api.categoriaVaga.create);

/**
 * @swagger
 * /api/v1/categoria-vaga/{id}:
 *   put:
 *     summary: Atualiza categoria existente
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Estágio Remunerado"
 *               descricao:
 *                 type: string
 *                 example: "Descrição atualizada"
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autenticado
 */
router.put('/:id', requireJwt, api.categoriaVaga.update);

/**
 * @swagger
 * /api/v1/categoria-vaga/{id}:
 *   delete:
 *     summary: Deleta categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso
 *       404:
 *         description: Categoria não encontrada
 *       401:
 *         description: Não autenticado
 */
router.delete('/:id', requireJwt, api.categoriaVaga.delete);

module.exports = router;
