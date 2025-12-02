const express = require('express');
const router = express.Router();
const api = require('../controllers/apiControllers');
const requireJwt = require('../../middleware/authMiddleware').requireJwt;

/**
 * @swagger
 * /api/v1/tags:
 *   get:
 *     summary: Lista todas as tags
 *     tags: [Tags]
 *     description: Retorna tags usadas para classificar vagas (relacionamento N:N)
 *     responses:
 *       200:
 *         description: Lista de tags retornada com sucesso
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
 *                       id_tag:
 *                         type: integer
 *                         example: 1
 *                       nome:
 *                         type: string
 *                         example: "JavaScript"
 */
router.get('/', api.tags.list);

/**
 * @swagger
 * /api/v1/tags/{id}:
 *   get:
 *     summary: Busca tag por ID
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Tag encontrada
 *       404:
 *         description: Tag não encontrada
 */
router.get('/:id', api.tags.show);

/**
 * @swagger
 * /api/v1/tags:
 *   post:
 *     summary: Cria nova tag
 *     tags: [Tags]
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
 *                 example: "React.js"
 *                 description: Nome da tag (deve ser único)
 *     responses:
 *       201:
 *         description: Tag criada com sucesso
 *       401:
 *         description: Não autenticado
 *       400:
 *         description: Tag já existe
 */
router.post('/', requireJwt, api.tags.create);

/**
 * @swagger
 * /api/v1/tags/{id}:
 *   put:
 *     summary: Atualiza tag existente
 *     tags: [Tags]
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
 *                 example: "Node.js"
 *     responses:
 *       200:
 *         description: Tag atualizada com sucesso
 *       404:
 *         description: Tag não encontrada
 *       401:
 *         description: Não autenticado
 */
router.put('/:id', requireJwt, api.tags.update);

/**
 * @swagger
 * /api/v1/tags/{id}:
 *   delete:
 *     summary: Deleta tag
 *     tags: [Tags]
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
 *         description: Tag deletada com sucesso
 *       404:
 *         description: Tag não encontrada
 *       401:
 *         description: Não autenticado
 */
router.delete('/:id', requireJwt, api.tags.delete);

module.exports = router;
