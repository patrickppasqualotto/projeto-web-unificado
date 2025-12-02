const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const eventosController = require('../controllers/eventosController');
const { requireSession, requireAdmin } = require('../middleware/authMiddleware');

// Middleware de autenticação e autorização para todas as rotas
router.use(requireSession);
router.use(requireAdmin);

// Validação de evento
const validateEvento = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('Título é obrigatório')
    .isLength({ min: 5, max: 200 })
    .withMessage('Título deve ter entre 5 e 200 caracteres'),
  body('descricao')
    .trim()
    .notEmpty()
    .withMessage('Descrição é obrigatória')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Descrição deve ter entre 10 e 2000 caracteres'),
  body('data_inicio')
    .notEmpty()
    .withMessage('Data de início é obrigatória')
    .isISO8601()
    .withMessage('Data inválida')
    .custom((value) => {
      const startDate = new Date(value);
      const now = new Date();
      if (startDate < now) {
        throw new Error('Data de início deve ser no futuro');
      }
      return true;
    }),
  body('data_fim')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Data final inválida')
    .custom((value, { req }) => {
      if (value) {
        const startDate = new Date(req.body.data_inicio);
        const endDate = new Date(value);
        if (endDate <= startDate) {
          throw new Error('Data final deve ser posterior à data de início');
        }
      }
      return true;
    }),
  body('local_evento')
    .trim()
    .notEmpty()
    .withMessage('Local do evento é obrigatório')
    .isLength({ min: 5, max: 200 })
    .withMessage('Local deve ter entre 5 e 200 caracteres'),
  body('link_inscricao')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!value || value === '') return true;
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('URL de inscrição inválida');
      }
    }),
  body('id_curso')
    .optional({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Curso inválido'),
];

// Rotas
router.get('/', eventosController.index);
router.get('/new', eventosController.new);
router.get('/:id', eventosController.show);
router.get('/:id/edit', eventosController.edit);
router.post('/', validateEvento, eventosController.create);
router.put('/:id', validateEvento, eventosController.update);
router.delete('/:id', eventosController.delete);

module.exports = router;
