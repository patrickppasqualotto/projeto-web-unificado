const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const noticiasController = require('../controllers/noticiasController');
const { requireSession, requireAdmin } = require('../middleware/authMiddleware');

// Middleware de autenticação e autorização para todas as rotas
router.use(requireSession);
router.use(requireAdmin);

// Validação de notícia
const validateNoticia = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('Título é obrigatório')
    .isLength({ min: 5, max: 200 })
    .withMessage('Título deve ter entre 5 e 200 caracteres'),
  body('subtitulo')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 300 })
    .withMessage('Subtítulo não pode exceder 300 caracteres'),
  body('conteudo')
    .trim()
    .notEmpty()
    .withMessage('Conteúdo é obrigatório')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Conteúdo deve ter entre 10 e 5000 caracteres'),
  body('imagem_url')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!value || value === '') return true;
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('URL da imagem inválida');
      }
    }),
  body('data_expiracao')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Data de expiração inválida'),
];

// Rotas
router.get('/', noticiasController.index);
router.get('/new', noticiasController.new);
router.get('/:id', noticiasController.show);
router.get('/:id/edit', noticiasController.edit);
router.post('/', validateNoticia, noticiasController.create);
router.put('/:id', validateNoticia, noticiasController.update);
router.delete('/:id', noticiasController.delete);

module.exports = router;
