const express = require('express');
const router = express.Router();
const api = require('../controllers/apiControllers');
const requireJwt = require('../../middleware/authMiddleware').requireJwt;

/**
 * @swagger
 * /api/v1/vagas:
 *   get:
 *     summary: Lista todas as vagas
 *     tags: [Vagas]
 *     description: Retorna vagas de estágio e emprego com suas tags (N:N)
 *     responses:
 *       200:
 *         description: Lista de vagas retornada com sucesso
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
 *                       id_vaga:
 *                         type: integer
 *                         example: 1
 *                       titulo:
 *                         type: string
 *                         example: "Estágio Desenvolvedor Node.js"
 *                       descricao:
 *                         type: string
 *                         example: "Oportunidade para estudantes de Ciência da Computação"
 *                       nome_empresa:
 *                         type: string
 *                         example: "Tech Solutions LTDA"
 *                       localizacao:
 *                         type: string
 *                         example: "Curitiba-PR"
 *                       salario:
 *                         type: number
 *                         example: 2000.00
 *                       data_expiracao:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-12-20T23:59:59Z"
 */
router.get('/', api.vagas.list);

/**
 * @swagger
 * /api/v1/vagas/{id}:
 *   get:
 *     summary: Busca vaga por ID
 *     tags: [Vagas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Vaga encontrada
 *       404:
 *         description: Vaga não encontrada
 */
router.get('/:id', api.vagas.show);

/**
 * @swagger
 * /api/v1/vagas:
 *   post:
 *     summary: Cria nova vaga
 *     tags: [Vagas]
 *     description: Cria vaga com relacionamento N:N com tags
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
 *                 example: "Estágio Desenvolvedor Node.js"
 *               descricao:
 *                 type: string
 *                 example: "Oportunidade para estudantes desenvolvendo APIs REST"
 *               requisitos:
 *                 type: string
 *                 example: "Cursando Ciência da Computação, conhecimento em JavaScript"
 *               nome_empresa:
 *                 type: string
 *                 example: "Tech Solutions"
 *               localizacao:
 *                 type: string
 *                 example: "Curitiba-PR"
 *               salario:
 *                 type: number
 *                 example: 2000.00
 *               data_expiracao:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-20T23:59:59Z"
 *               url:
 *                 type: string
 *                 example: "https://vagas.empresa.com/123"
 *               id_categoria:
 *                 type: integer
 *                 example: 1
 *                 description: ID da categoria da vaga
 *               tags:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 3, 5]
 *                 description: Array de IDs das tags (relacionamento N:N)
 *     responses:
 *       201:
 *         description: Vaga criada com sucesso
 *       401:
 *         description: Não autenticado
 */
router.post('/', requireJwt, api.vagas.create);

/**
 * @swagger
 * /api/v1/vagas/{id}:
 *   put:
 *     summary: Atualiza vaga existente
 *     tags: [Vagas]
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
 *                 example: "Estágio Node.js - Atualizado"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 4]
 *     responses:
 *       200:
 *         description: Vaga atualizada com sucesso
 *       404:
 *         description: Vaga não encontrada
 *       401:
 *         description: Não autenticado
 */
router.put('/:id', requireJwt, api.vagas.update);

/**
 * @swagger
 * /api/v1/vagas/{id}:
 *   delete:
 *     summary: Deleta vaga
 *     tags: [Vagas]
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
 *         description: Vaga deletada com sucesso
 *       404:
 *         description: Vaga não encontrada
 *       401:
 *         description: Não autenticado
 */
router.delete('/:id', requireJwt, api.vagas.delete);

module.exports = router;
