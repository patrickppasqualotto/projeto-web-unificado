const express = require('express');
const router = express.Router();
const api = require('../controllers/apiControllers');
const requireJwt = require('../../middleware/authMiddleware').requireJwt;

/**
 * @swagger
 * /api/v1/eventos:
 *   get:
 *     summary: Lista todos os eventos
 *     tags: [Eventos]
 *     description: Retorna lista de eventos (sem autenticação)
 *     responses:
 *       200:
 *         description: Lista de eventos retornada com sucesso
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
 *                       id_evento:
 *                         type: integer
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         example: "Semana Acadêmica 2025"
 *                       descricao:
 *                         type: string
 *                         example: "Evento anual com palestras e workshops"
 *                       data_inicio:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-12-10T08:00:00Z"
 *                       data_fim:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-12-15T18:00:00Z"
 *                       local_evento:
 *                         type: string
 *                         example: "Campus Curitiba - Auditório Principal"
 *                       link_inscricao:
 *                         type: string
 *                         example: "https://eventos.utfpr.edu.br/inscricao"
 */
router.get('/', api.eventos.list);

/**
 * @swagger
 * /api/v1/eventos/{id}:
 *   get:
 *     summary: Busca evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento não encontrado
 */
router.get('/:id', api.eventos.show);

/**
 * @swagger
 * /api/v1/eventos:
 *   post:
 *     summary: Cria novo evento
 *     tags: [Eventos]
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
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: "Semana Acadêmica 2025"
 *               descricao:
 *                 type: string
 *                 example: "Evento anual com palestras, workshops e networking"
 *               data_inicio:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-10T08:00:00Z"
 *               data_fim:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-15T18:00:00Z"
 *               local_evento:
 *                 type: string
 *                 example: "Campus Curitiba"
 *               link_inscricao:
 *                 type: string
 *                 example: "https://eventos.utfpr.edu.br/inscricao"
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       401:
 *         description: Não autenticado
 */
router.post('/', requireJwt, api.eventos.create);

/**
 * @swagger
 * /api/v1/eventos/{id}:
 *   put:
 *     summary: Atualiza evento existente
 *     tags: [Eventos]
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
 *                 example: "Semana Acadêmica 2025 - Atualizado"
 *               descricao:
 *                 type: string
 *                 example: "Descrição atualizada do evento"
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *       404:
 *         description: Evento não encontrado
 *       401:
 *         description: Não autenticado
 */
router.put('/:id', requireJwt, api.eventos.update);

/**
 * @swagger
 * /api/v1/eventos/{id}:
 *   delete:
 *     summary: Deleta evento
 *     tags: [Eventos]
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
 *         description: Evento deletado com sucesso
 *       404:
 *         description: Evento não encontrado
 *       401:
 *         description: Não autenticado
 */
router.delete('/:id', requireJwt, api.eventos.delete);

module.exports = router;
