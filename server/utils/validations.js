/**
 * VALIDATIONS - Regras de Validação Centralizadas
 * 
 * Centraliza regras de validação para use em rotas MVC e API
 * Facilita manutenção e consistência
 */

const { body, validationResult } = require('express-validator');

/**
 * Configurações de validação por entidade
 */
const validationRules = {
  // ========== TAGS ==========
  tags: {
    nome: body('nome')
      .trim()
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres')
      .matches(/^[a-zA-Z0-9\s\-áéíóúãõçñ]+$/i)
      .withMessage('Nome contém caracteres inválidos')
  },

  // ========== CATEGORIAS DE VAGA ==========
  categoriaVaga: {
    nome: body('nome')
      .trim()
      .notEmpty()
      .withMessage('Nome é obrigatório')
      .isLength({ min: 2, max: 100 })
      .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    descricao: body('descricao')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Descrição não pode ultrapassar 500 caracteres')
  },

  // ========== VAGAS ==========
  vagas: {
    titulo: body('titulo')
      .trim()
      .notEmpty()
      .withMessage('Título é obrigatório')
      .isLength({ min: 5, max: 200 })
      .withMessage('Título deve ter entre 5 e 200 caracteres'),
    descricao: body('descricao')
      .trim()
      .notEmpty()
      .withMessage('Descrição é obrigatória')
      .isLength({ min: 10, max: 2000 })
      .withMessage('Descrição deve ter entre 10 e 2000 caracteres'),
    requisitos: body('requisitos')
      .trim()
      .notEmpty()
      .withMessage('Requisitos é obrigatório')
      .isLength({ min: 10, max: 2000 })
      .withMessage('Requisitos deve ter entre 10 e 2000 caracteres'),
    categoria: body('id_categoria')
      .notEmpty()
      .withMessage('Categoria é obrigatória')
      .isInt()
      .withMessage('Categoria inválida'),
    dataExpiracao: body('data_expiracao')
      .notEmpty()
      .withMessage('Data de expiração é obrigatória')
      .isISO8601()
      .withMessage('Data inválida')
      .custom(value => {
        const data = new Date(value);
        if (data <= new Date()) {
          throw new Error('Data de expiração deve ser futura');
        }
        return true;
      }),
    salario: body('salario')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Salário deve ser um número válido'),
    empresa: body('nome_empresa')
      .optional()
      .trim()
      .isLength({ min: 2, max: 150 })
      .withMessage('Empresa deve ter entre 2 e 150 caracteres'),
    localizacao: body('localizacao')
      .optional()
      .trim()
      .isLength({ min: 2, max: 150 })
      .withMessage('Localização deve ter entre 2 e 150 caracteres'),
    url: body('url')
      .optional()
      .isURL()
      .withMessage('URL inválida'),
    tags: body('tags')
      .optional()
      .isArray()
      .withMessage('Tags deve ser um array')
  },

  // ========== EVENTOS ==========
  eventos: {
    titulo: body('titulo')
      .trim()
      .notEmpty()
      .withMessage('Título é obrigatório')
      .isLength({ min: 5, max: 200 })
      .withMessage('Título deve ter entre 5 e 200 caracteres'),
    descricao: body('descricao')
      .trim()
      .notEmpty()
      .withMessage('Descrição é obrigatória')
      .isLength({ min: 10, max: 2000 })
      .withMessage('Descrição deve ter entre 10 e 2000 caracteres'),
    dataInicio: body('data_inicio')
      .notEmpty()
      .withMessage('Data de início é obrigatória')
      .isISO8601()
      .withMessage('Data inválida')
      .custom(value => {
        const data = new Date(value);
        if (data <= new Date()) {
          throw new Error('Data de início deve ser futura');
        }
        return true;
      }),
    dataFim: body('data_fim')
      .optional()
      .isISO8601()
      .withMessage('Data inválida')
      .custom((value, { req }) => {
        if (value) {
          const dataFim = new Date(value);
          const dataInicio = new Date(req.body.data_inicio);
          if (dataFim <= dataInicio) {
            throw new Error('Data de fim deve ser posterior à data de início');
          }
        }
        return true;
      }),
    localizacao: body('local_evento')
      .trim()
      .notEmpty()
      .withMessage('Localização é obrigatória')
      .isLength({ min: 2, max: 200 })
      .withMessage('Localização deve ter entre 2 e 200 caracteres'),
    linkInscricao: body('link_inscricao')
      .optional()
      .isURL()
      .withMessage('Link de inscrição deve ser uma URL válida'),
    curso: body('id_curso')
      .optional()
      .isInt()
      .withMessage('Curso inválido')
  },

  // ========== NOTÍCIAS ==========
  noticias: {
    titulo: body('titulo')
      .trim()
      .notEmpty()
      .withMessage('Título é obrigatório')
      .isLength({ min: 5, max: 200 })
      .withMessage('Título deve ter entre 5 e 200 caracteres'),
    subtitulo: body('subtitulo')
      .optional()
      .trim()
      .isLength({ max: 300 })
      .withMessage('Subtítulo não pode ultrapassar 300 caracteres'),
    conteudo: body('conteudo')
      .trim()
      .notEmpty()
      .withMessage('Conteúdo é obrigatório')
      .isLength({ min: 10, max: 5000 })
      .withMessage('Conteúdo deve ter entre 10 e 5000 caracteres'),
    imagemUrl: body('imagem_url')
      .optional()
      .isURL()
      .withMessage('URL da imagem inválida'),
    dataExpiracao: body('data_expiracao')
      .optional()
      .isISO8601()
      .withMessage('Data inválida')
  },

  // ========== OPORTUNIDADES ==========
  oportunidades: {
    titulo: body('titulo')
      .trim()
      .notEmpty()
      .withMessage('Título é obrigatório')
      .isLength({ min: 5, max: 200 })
      .withMessage('Título deve ter entre 5 e 200 caracteres'),
    descricao: body('descricao')
      .trim()
      .notEmpty()
      .withMessage('Descrição é obrigatória')
      .isLength({ min: 10, max: 3000 })
      .withMessage('Descrição deve ter entre 10 e 3000 caracteres'),
    tipo: body('id_tipo_oportunidade')
      .notEmpty()
      .withMessage('Tipo é obrigatório')
      .isInt()
      .withMessage('Tipo inválido'),
    dataPrazo: body('data_prazo')
      .optional()
      .isISO8601()
      .withMessage('Data inválida')
      .custom(value => {
        if (value) {
          const data = new Date(value);
          if (data <= new Date()) {
            throw new Error('Data de prazo deve ser futura');
          }
        }
        return true;
      }),
    link: body('link')
      .optional()
      .isURL()
      .withMessage('Link inválido')
  },

  // ========== INFORMAÇÕES ==========
  informacoes: {
    chave: body('chave')
      .trim()
      .notEmpty()
      .withMessage('Chave é obrigatória')
      .isLength({ min: 2 })
      .withMessage('Chave deve ter pelo menos 2 caracteres'),
    titulo: body('titulo')
      .trim()
      .notEmpty()
      .withMessage('Título é obrigatório')
      .isLength({ min: 3 })
      .withMessage('Título deve ter pelo menos 3 caracteres'),
    descricao: body('descricao')
      .trim()
      .notEmpty()
      .withMessage('Descrição é obrigatória')
      .isLength({ min: 3 })
      .withMessage('Descrição deve ter pelo menos 3 caracteres')
  }
};

/**
 * Função helper para obter validações de uma entidade
 * @param {string} entity - Nome da entidade (tags, vagas, etc)
 * @param {array} fields - Array de campos a validar
 * @returns {array} Array de validadores
 */
function getValidations(entity, fields = []) {
  if (!validationRules[entity]) {
    throw new Error(`Entidade "${entity}" não tem regras de validação`);
  }

  const entityRules = validationRules[entity];

  if (fields.length === 0) {
    return Object.values(entityRules);
  }

  return fields
    .filter(field => entityRules[field])
    .map(field => entityRules[field]);
}

/**
 * Middleware para validar e retornar erros
 * @param {object} req - Objeto da requisição
 * @param {object} res - Objeto da resposta
 * @returns {array|null} Array de erros ou null se válido
 */
function getValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errors.array();
  }
  return null;
}

/**
 * Middleware para aplicar validações
 */
function validateRequest(req, res, next) {
  const errors = getValidationErrors(req, res);
  if (errors) {
    return res.status(400).json({ errors });
  }
  next();
}

module.exports = {
  validationRules,
  getValidations,
  getValidationErrors,
  validateRequest,
  body // Re-export para uso em rotas
};
