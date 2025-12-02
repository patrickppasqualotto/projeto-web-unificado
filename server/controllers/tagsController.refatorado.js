/**
 * TAGS CONTROLLER (REFATORADO) - Manipulação de requisições HTTP para Tags
 * 
 * Este é um exemplo de como refatorar controllers para usar:
 * - Services para lógica de negócio
 * - Validações centralizadas
 * - Tratamento de erros global
 * - Message handler para feedback do usuário
 */

const TagsService = require('../services/TagsService');
const { getValidations, getValidationErrors } = require('../utils/validations');
const { setSuccessMessage, setErrorMessage } = require('../utils/messageHandler');
const { asyncHandler, AppError } = require('../utils/errorHandler');

const tagsService = new TagsService();

/**
 * GET /tags - Listar todas as tags
 */
exports.index = asyncHandler(async (req, res) => {
  const tags = await tagsService.listarOrdenadas();
  res.render('tags/index', { tags, title: 'Tags' });
});

/**
 * GET /tags/new - Formulário de criação
 */
exports.new = asyncHandler(async (req, res) => {
  res.render('tags/form', {
    title: 'Nova Tag',
    tag: null,
    errors: [],
    action: '/tags',
    method: 'POST',
  });
});

/**
 * GET /tags/:id - Visualizar tag
 */
exports.show = asyncHandler(async (req, res) => {
  const tag = await tagsService.obter(req.params.id);
  res.render('tags/show', { tag, title: `Tag: ${tag.nome}` });
});

/**
 * GET /tags/:id/edit - Formulário de edição
 */
exports.edit = asyncHandler(async (req, res) => {
  const tag = await tagsService.obter(req.params.id);
  res.render('tags/form', {
    title: `Editar Tag: ${tag.nome}`,
    tag,
    errors: [],
    action: `/tags/${tag.id_tag}`,
    method: 'PUT',
  });
});

/**
 * POST /tags - Criar nova tag
 */
exports.create = asyncHandler(async (req, res) => {
  // Validação de entrada (middleware express-validator já rodou antes)
  const errors = getValidationErrors(req, res);
  if (errors) {
    return res.status(400).render('tags/form', {
      title: 'Nova Tag',
      tag: req.body,
      errors,
      action: '/tags',
      method: 'POST',
    });
  }

  try {
    const tag = await tagsService.criarUnica({
      nome: req.body.nome.trim()
    });

    setSuccessMessage(req, `Tag "${tag.nome}" criada com sucesso!`);
    res.redirect(`/tags/${tag.id_tag}`);
  } catch (error) {
    // Erros de negócio são capturados aqui
    const errors = [{ msg: error.message || 'Erro ao criar tag' }];
    res.status(error.status || 400).render('tags/form', {
      title: 'Nova Tag',
      tag: req.body,
      errors,
      action: '/tags',
      method: 'POST',
    });
  }
});

/**
 * PUT /tags/:id - Atualizar tag
 */
exports.update = asyncHandler(async (req, res) => {
  // Validação de entrada
  const errors = getValidationErrors(req, res);
  const tag = await tagsService.obter(req.params.id);

  if (errors) {
    return res.status(400).render('tags/form', {
      title: `Editar Tag: ${tag.nome}`,
      tag: { ...tag.toJSON(), ...req.body },
      errors,
      action: `/tags/${tag.id_tag}`,
      method: 'PUT',
    });
  }

  try {
    const tagAtualizada = await tagsService.atualizar(req.params.id, {
      nome: req.body.nome.trim()
    });

    setSuccessMessage(req, `Tag "${tagAtualizada.nome}" atualizada com sucesso!`);
    res.redirect(`/tags/${tagAtualizada.id_tag}`);
  } catch (error) {
    const errors = [{ msg: error.message || 'Erro ao atualizar tag' }];
    res.status(error.status || 400).render('tags/form', {
      title: `Editar Tag: ${tag.nome}`,
      tag: tag.toJSON(),
      errors,
      action: `/tags/${tag.id_tag}`,
      method: 'PUT',
    });
  }
});

/**
 * DELETE /tags/:id - Deletar tag
 */
exports.delete = asyncHandler(async (req, res) => {
  try {
    const tag = await tagsService.obter(req.params.id);
    const tagNome = tag.nome;

    await tagsService.deletar(req.params.id);

    setSuccessMessage(req, `Tag "${tagNome}" deletada com sucesso!`);
    res.redirect('/tags');
  } catch (error) {
    setErrorMessage(req, error.message || 'Erro ao deletar tag');
    res.redirect('/tags');
  }
});
