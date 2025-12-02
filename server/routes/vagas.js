const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const vagasController = require('../controllers/vagasController');
const { requireSession, requireAdmin } = require('../middleware/authMiddleware');

// Middleware de autenticação e autorização para todas as rotas
router.use(requireSession);
router.use(requireAdmin);

// Validação de vaga
const validateVaga = [
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
  body('requisitos')
    .trim()
    .notEmpty()
    .withMessage('Requisitos são obrigatórios')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Requisitos devem ter entre 10 e 2000 caracteres'),
  body('id_categoria')
    .isInt({ min: 1 })
    .withMessage('Categoria é obrigatória'),
  body('data_expiracao')
    .notEmpty()
    .withMessage('Data de expiração é obrigatória')
    .isISO8601()
    .withMessage('Data inválida')
    .custom((value) => {
      const expDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expDate < today) {
        throw new Error('Data de expiração deve ser no futuro');
      }
      return true;
    }),
  body('nome_empresa')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Nome da empresa não pode exceder 150 caracteres'),
  body('localizacao')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 150 })
    .withMessage('Localização não pode exceder 150 caracteres'),
  body('salario')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Salário deve ser um número válido'),
  body('url')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!value || value === '') return true;
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('URL inválida');
      }
    }),
];

// Rotas
router.get('/', vagasController.index);
router.get('/new', vagasController.new);
router.get('/:id', vagasController.show);
router.get('/:id/edit', vagasController.edit);
router.post('/', validateVaga, vagasController.create);
router.put('/:id', validateVaga, vagasController.update);
router.delete('/:id', vagasController.delete);

module.exports = router;
