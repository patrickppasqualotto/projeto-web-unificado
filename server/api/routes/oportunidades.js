const express = require('express');
const router = express.Router();
const api = require('../controllers/apiControllers');
const requireJwt = require('../../middleware/authMiddleware').requireJwt;

/**
 * @swagger
 * /api/v1/oportunidades:
 *   get:
 *     summary: Lista todas as oportunidades acadêmicas
 *     tags: [Oportunidades]
 *     description: Retorna bolsas, programas de pesquisa e extensão
 *     responses:
 *       200:
 *         description: Lista de oportunidades retornada com sucesso
 */
router.get('/', api.oportunidades.list);

/**
 * @swagger
 * /api/v1/oportunidades/{id}:
 *   get:
 *     summary: Busca oportunidade por ID
 *     tags: [Oportunidades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Oportunidade encontrada
 *       404:
 *         description: Oportunidade não encontrada
 */
router.get('/:id', api.oportunidades.show);

/**
 * @swagger
 * /api/v1/oportunidades:
 *   post:
 *     summary: Cria nova oportunidade acadêmica
 *     tags: [Oportunidades]
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
 *               - descricao
 *               - id_tipo_oportunidade
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Bolsa Iniciação Científica PIBIC"
 *               descricao:
 *                 type: string
 *                 example: "Projeto de pesquisa em inteligência artificial aplicada"
 *               id_tipo_oportunidade:
 *                 type: integer
 *                 example: 1
 *                 description: Tipo da oportunidade (bolsa, extensão, etc)
 *               link:
 *                 type: string
 *                 example: "https://portal.utfpr.edu.br/bolsas/pibic"
 *               data_prazo:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-15T23:59:59Z"
 *     responses:
 *       201:
 *         description: Oportunidade criada com sucesso
 *       401:
 *         description: Não autenticado
 */
router.post('/', requireJwt, api.oportunidades.create);

/**
 * @swagger
 * /api/v1/oportunidades/{id}:
 *   put:
 *     summary: Atualiza oportunidade existente
 *     tags: [Oportunidades]
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
 *               titulo:
 *                 type: string
 *                 example: "Bolsa PIBIC 2025 - Atualizado"
 *               descricao:
 *                 type: string
 *                 example: "Descrição atualizada"
 *     responses:
 *       200:
 *         description: Oportunidade atualizada com sucesso
 *       404:
 *         description: Oportunidade não encontrada
 *       401:
 *         description: Não autenticado
 */
router.put('/:id', requireJwt, api.oportunidades.update);

/**
 * @swagger
 * /api/v1/oportunidades/{id}:
 *   delete:
 *     summary: Deleta oportunidade
 *     tags: [Oportunidades]
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
 *         description: Oportunidade deletada com sucesso
 *       404:
 *         description: Oportunidade não encontrada
 *       401:
 *         description: Não autenticado
 */
router.delete('/:id', requireJwt, api.oportunidades.delete);

module.exports = router;
