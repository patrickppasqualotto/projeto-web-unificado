const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const informacoesController = require('../controllers/informacoesController');
const { requireSession, requireAdmin } = require('../middleware/authMiddleware');

// Middleware de autenticação e autorização para todas as rotas
router.use(requireSession);
router.use(requireAdmin);

const validateInformacao = [
  body('chave').trim().isLength({ min: 2 }).withMessage('Chave deve ter pelo menos 2 caracteres'),
  body('titulo').trim().isLength({ min: 3 }).withMessage('Título deve ter pelo menos 3 caracteres'),
  body('descricao').trim().isLength({ min: 3 }).withMessage('Descrição muito curta'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('informacoes/form', { title: req.body.titulo || 'Informação', informacao: req.body, isEdit: false, errors: errors.array() });
    }
    next();
  }
];

router.get('/', informacoesController.index);
router.get('/new', informacoesController.new);
router.get('/:id', informacoesController.show);
router.get('/:id/edit', informacoesController.edit);
router.post('/', validateInformacao, informacoesController.create);
router.put('/:id', validateInformacao, informacoesController.update);
router.delete('/:id', informacoesController.delete);

module.exports = router;
