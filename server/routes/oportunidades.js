const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const oportunidadesController = require('../controllers/oportunidadesController');
const { requireSession, requireAdmin } = require('../middleware/authMiddleware');

// Middleware de autenticação e autorização para todas as rotas
router.use(requireSession);
router.use(requireAdmin);

// Validação middleware
const validateOportunidade = [
  body('titulo')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Título deve ter entre 5 e 200 caracteres'),
  body('descricao')
    .trim()
    .isLength({ min: 10, max: 3000 })
    .withMessage('Descrição deve ter entre 10 e 3000 caracteres'),
  body('id_tipo_oportunidade')
    .isInt()
    .withMessage('Tipo de oportunidade inválido'),
  body('data_prazo')
    .optional()
    .isISO8601()
    .withMessage('Data inválida'),
  body('link')
    .optional()
    .isURL()
    .withMessage('Link deve ser uma URL válida'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('oportunidades/form', {
        title: req.body.titulo || 'Nova Oportunidade',
        oportunidade: req.body,
        tipos: [],
        isEdit: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Rotas
router.get('/', oportunidadesController.index);
router.get('/new', oportunidadesController.new);
router.get('/:id', oportunidadesController.show);
router.get('/:id/edit', oportunidadesController.edit);
router.post('/', validateOportunidade, oportunidadesController.create);
router.put('/:id', validateOportunidade, oportunidadesController.update);
router.delete('/:id', oportunidadesController.delete);

module.exports = router;
