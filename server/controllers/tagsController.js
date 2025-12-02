const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const Tags = require(path.resolve(__dirname, '../../models/Tags'))(sequelize, DataTypes);
const { validationResult } = require('express-validator');

// GET /tags - Listar todas as tags
exports.index = async (req, res) => {
  try {
    const tags = await Tags.findAll({
      order: [['nome', 'ASC']],
    });
    res.render('tags/index', { tags, title: 'Tags' });
  } catch (error) {
    console.error('Erro ao listar tags:', error);
    res.status(500).render('error', { message: 'Erro ao carregar tags' });
  }
};

// GET /tags/new - Formulário de criação
exports.new = async (req, res) => {
  try {
    res.render('tags/form', {
      title: 'Nova Tag',
      tag: null,
      errors: [],
      action: '/tags',
      method: 'POST',
    });
  } catch (error) {
    console.error('Erro ao exibir formulário:', error);
    res.status(500).render('error', { message: 'Erro ao carregar formulário' });
  }
};

// GET /tags/:id - Visualizar tag
exports.show = async (req, res) => {
  try {
    const tag = await Tags.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).render('error', { message: 'Tag não encontrada' });
    }
    res.render('tags/show', { tag, title: `Tag: ${tag.nome}` });
  } catch (error) {
    console.error('Erro ao buscar tag:', error);
    res.status(500).render('error', { message: 'Erro ao carregar tag' });
  }
};

// GET /tags/:id/edit - Formulário de edição
exports.edit = async (req, res) => {
  try {
    const tag = await Tags.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).render('error', { message: 'Tag não encontrada' });
    }
    res.render('tags/form', {
      title: `Editar Tag: ${tag.nome}`,
      tag,
      errors: [],
      action: `/tags/${tag.id_tag}`,
      method: 'PUT',
    });
  } catch (error) {
    console.error('Erro ao exibir formulário de edição:', error);
    res.status(500).render('error', { message: 'Erro ao carregar formulário' });
  }
};

// POST /tags - Criar nova tag
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('tags/form', {
      title: 'Nova Tag',
      tag: req.body,
      errors: errors.array(),
      action: '/tags',
      method: 'POST',
    });
  }

  try {
    const tag = await Tags.create({
      nome: req.body.nome.trim(),
    });
    req.session.message = {
      type: 'success',
      text: `Tag "${tag.nome}" criada com sucesso!`,
    };
    res.redirect(`/tags/${tag.id_tag}`);
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    return res.status(400).render('tags/form', {
      title: 'Nova Tag',
      tag: req.body,
      errors: [{ msg: 'Erro ao criar tag. Tente novamente.' }],
      action: '/tags',
      method: 'POST',
    });
  }
};

// PUT /tags/:id - Atualizar tag
exports.update = async (req, res) => {
  const errors = validationResult(req);
  const tag = await Tags.findByPk(req.params.id);

  if (!tag) {
    return res.status(404).render('error', { message: 'Tag não encontrada' });
  }

  if (!errors.isEmpty()) {
    return res.status(400).render('tags/form', {
      title: `Editar Tag: ${tag.nome}`,
      tag: { ...tag.toJSON(), ...req.body },
      errors: errors.array(),
      action: `/tags/${tag.id_tag}`,
      method: 'PUT',
    });
  }

  try {
    await tag.update({
      nome: req.body.nome.trim(),
    });
    req.session.message = {
      type: 'success',
      text: `Tag "${tag.nome}" atualizada com sucesso!`,
    };
    res.redirect(`/tags/${tag.id_tag}`);
  } catch (error) {
    console.error('Erro ao atualizar tag:', error);
    return res.status(400).render('tags/form', {
      title: `Editar Tag: ${tag.nome}`,
      tag: tag.toJSON(),
      errors: [{ msg: 'Erro ao atualizar tag. Tente novamente.' }],
      action: `/tags/${tag.id_tag}`,
      method: 'PUT',
    });
  }
};

// DELETE /tags/:id - Deletar tag
exports.delete = async (req, res) => {
  try {
    const tag = await Tags.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).render('error', { message: 'Tag não encontrada' });
    }

    const tagNome = tag.nome;
    await tag.destroy();
    req.session.message = {
      type: 'success',
      text: `Tag "${tagNome}" deletada com sucesso!`,
    };
    res.redirect('/tags');
  } catch (error) {
    console.error('Erro ao deletar tag:', error);
    req.session.message = {
      type: 'error',
      text: 'Erro ao deletar tag. Tente novamente.',
    };
    res.redirect('/tags');
  }
};
