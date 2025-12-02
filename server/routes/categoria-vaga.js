const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoriavagaController = require('../controllers/categoriavagaController');
const { requireSession, requireAdmin } = require('../middleware/authMiddleware');

// Middleware de autenticação e autorização para todas as rotas
router.use(requireSession);
router.use(requireAdmin);

// Validação de categoria
const validateCategoria = [
  body('nome')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 3, max: 100 })
    .withMessage('Nome deve ter entre 3 e 100 caracteres')
    .matches(/^[a-zA-Z0-9\s\-áéíóúãõçñ]+$/i)
    .withMessage('Nome contém caracteres inválidos'),
  body('descricao')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Descrição não pode exceder 500 caracteres'),
];

// Rotas
router.get('/', categoriavagaController.index);
router.get('/new', categoriavagaController.new);
router.get('/:id', categoriavagaController.show);
router.get('/:id/edit', categoriavagaController.edit);
router.post('/', validateCategoria, categoriavagaController.create);
router.put('/:id', validateCategoria, categoriavagaController.update);
router.delete('/:id', categoriavagaController.delete);

module.exports = router;
