const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const tagsController = require('../controllers/tagsController');
const { requireSession, requireAdmin } = require('../middleware/authMiddleware');

// Middleware de autenticação e autorização para todas as rotas
router.use(requireSession);
router.use(requireAdmin);

// Validação de nome da tag
const validateTag = [
  body('nome')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-Z0-9\s\-áéíóúãõçñ]+$/i)
    .withMessage('Nome contém caracteres inválidos'),
];

// Rotas
router.get('/', tagsController.index);
router.get('/new', tagsController.new);
router.get('/:id', tagsController.show);
router.get('/:id/edit', tagsController.edit);
router.post('/', validateTag, tagsController.create);
router.put('/:id', validateTag, tagsController.update);
router.delete('/:id', tagsController.delete);

module.exports = router;
