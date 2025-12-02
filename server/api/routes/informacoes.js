const express = require('express');
const router = express.Router();
const api = require('../controllers/apiControllers');
const requireJwt = require('../../middleware/authMiddleware').requireJwt;

/**
 * @swagger
 * /api/v1/informacoes:
 *   get:
 *     summary: Lista todas as informações institucionais
 *     tags: [Informações]
 *     description: Retorna informações de contato e dados da universidade
 *     responses:
 *       200:
 *         description: Lista de informações retornada com sucesso
 */
router.get('/', api.informacoes.list);

/**
 * @swagger
 * /api/v1/informacoes/{id}:
 *   get:
 *     summary: Busca informação por ID
 *     tags: [Informações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Informação encontrada
 *       404:
 *         description: Informação não encontrada
 */
router.get('/:id', api.informacoes.show);

/**
 * @swagger
 * /api/v1/informacoes:
 *   post:
 *     summary: Cria nova informação institucional
 *     tags: [Informações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chave
 *               - titulo
 *             properties:
 *               chave:
 *                 type: string
 *                 example: "horario_atendimento"
 *                 description: Chave única de identificação
 *               titulo:
 *                 type: string
 *                 example: "Horário de Atendimento"
 *               conteudo:
 *                 type: string
 *                 example: "Segunda a Sexta: 8h às 18h"
 *               telefone:
 *                 type: string
 *                 example: "(41) 3310-4545"
 *               email:
 *                 type: string
 *                 example: "contato@utfpr.edu.br"
 *               endereco:
 *                 type: string
 *                 example: "Av. Sete de Setembro, 3165 - Curitiba/PR"
 *     responses:
 *       201:
 *         description: Informação criada com sucesso
 *       401:
 *         description: Não autenticado
 */
router.post('/', requireJwt, api.informacoes.create);

/**
 * @swagger
 * /api/v1/informacoes/{id}:
 *   put:
 *     summary: Atualiza informação existente
 *     tags: [Informações]
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
 *                 example: "Horário Atualizado"
 *               conteudo:
 *                 type: string
 *                 example: "Segunda a Sexta: 9h às 19h"
 *     responses:
 *       200:
 *         description: Informação atualizada com sucesso
 *       404:
 *         description: Informação não encontrada
 *       401:
 *         description: Não autenticado
 */
router.put('/:id', requireJwt, api.informacoes.update);

/**
 * @swagger
 * /api/v1/informacoes/{id}:
 *   delete:
 *     summary: Deleta informação
 *     tags: [Informações]
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
 *         description: Informação deletada com sucesso
 *       404:
 *         description: Informação não encontrada
 *       401:
 *         description: Não autenticado
 */
router.delete('/:id', requireJwt, api.informacoes.delete);

module.exports = router;
