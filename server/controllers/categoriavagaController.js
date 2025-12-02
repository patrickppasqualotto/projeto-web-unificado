const path = require('path');
const { sequelize } = require(path.resolve(__dirname, '../../Configuracao/database'));
const { DataTypes } = require('sequelize');
const Categoria_vaga = require(path.resolve(__dirname, '../../models/Categoria_vaga'))(sequelize, DataTypes);
const { validationResult } = require('express-validator');

// GET /categoria-vaga - Listar todas as categorias
exports.index = async (req, res) => {
  try {
    const categorias = await Categoria_vaga.findAll({
      order: [['nome', 'ASC']],
    });
    res.render('categoria-vaga/index', { categorias, title: 'Categorias de Vagas' });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).render('error', { message: 'Erro ao carregar categorias' });
  }
};

// GET /categoria-vaga/new - Formulário de criação
exports.new = async (req, res) => {
  try {
    res.render('categoria-vaga/form', {
      title: 'Nova Categoria',
      categoria: null,
      errors: [],
      action: '/categoria-vaga',
      method: 'POST',
    });
  } catch (error) {
    console.error('Erro ao exibir formulário:', error);
    res.status(500).render('error', { message: 'Erro ao carregar formulário' });
  }
};

// GET /categoria-vaga/:id - Visualizar categoria
exports.show = async (req, res) => {
  try {
    const categoria = await Categoria_vaga.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).render('error', { message: 'Categoria não encontrada' });
    }
    res.render('categoria-vaga/show', { categoria, title: `Categoria: ${categoria.nome}` });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).render('error', { message: 'Erro ao carregar categoria' });
  }
};

// GET /categoria-vaga/:id/edit - Formulário de edição
exports.edit = async (req, res) => {
  try {
    const categoria = await Categoria_vaga.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).render('error', { message: 'Categoria não encontrada' });
    }
    res.render('categoria-vaga/form', {
      title: `Editar Categoria: ${categoria.nome}`,
      categoria,
      errors: [],
      action: `/categoria-vaga/${categoria.id_categoria}`,
      method: 'PUT',
    });
  } catch (error) {
    console.error('Erro ao exibir formulário de edição:', error);
    res.status(500).render('error', { message: 'Erro ao carregar formulário' });
  }
};

// POST /categoria-vaga - Criar nova categoria
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('categoria-vaga/form', {
      title: 'Nova Categoria',
      categoria: req.body,
      errors: errors.array(),
      action: '/categoria-vaga',
      method: 'POST',
    });
  }

  try {
    const categoria = await Categoria_vaga.create({
      nome: req.body.nome.trim(),
      descricao: req.body.descricao ? req.body.descricao.trim() : null,
    });
    req.session.message = {
      type: 'success',
      text: `Categoria "${categoria.nome}" criada com sucesso!`,
    };
    res.redirect(`/categoria-vaga/${categoria.id_categoria}`);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(400).render('categoria-vaga/form', {
      title: 'Nova Categoria',
      categoria: req.body,
      errors: [{ msg: 'Erro ao criar categoria. Tente novamente.' }],
      action: '/categoria-vaga',
      method: 'POST',
    });
  }
};

// PUT /categoria-vaga/:id - Atualizar categoria
exports.update = async (req, res) => {
  const errors = validationResult(req);
  const categoria = await Categoria_vaga.findByPk(req.params.id);

  if (!categoria) {
    return res.status(404).render('error', { message: 'Categoria não encontrada' });
  }

  if (!errors.isEmpty()) {
    return res.status(400).render('categoria-vaga/form', {
      title: `Editar Categoria: ${categoria.nome}`,
      categoria: { ...categoria.toJSON(), ...req.body },
      errors: errors.array(),
      action: `/categoria-vaga/${categoria.id_categoria}`,
      method: 'PUT',
    });
  }

  try {
    await categoria.update({
      nome: req.body.nome.trim(),
      descricao: req.body.descricao ? req.body.descricao.trim() : null,
    });
    req.session.message = {
      type: 'success',
      text: `Categoria "${categoria.nome}" atualizada com sucesso!`,
    };
    res.redirect(`/categoria-vaga/${categoria.id_categoria}`);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return res.status(400).render('categoria-vaga/form', {
      title: `Editar Categoria: ${categoria.nome}`,
      categoria: categoria.toJSON(),
      errors: [{ msg: 'Erro ao atualizar categoria. Tente novamente.' }],
      action: `/categoria-vaga/${categoria.id_categoria}`,
      method: 'PUT',
    });
  }
};

// DELETE /categoria-vaga/:id - Deletar categoria
exports.delete = async (req, res) => {
  try {
    const categoria = await Categoria_vaga.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).render('error', { message: 'Categoria não encontrada' });
    }

    const categoriaNome = categoria.nome;
    await categoria.destroy();
    req.session.message = {
      type: 'success',
      text: `Categoria "${categoriaNome}" deletada com sucesso!`,
    };
    res.redirect('/categoria-vaga');
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    req.session.message = {
      type: 'error',
      text: 'Erro ao deletar categoria. Tente novamente.',
    };
    res.redirect('/categoria-vaga');
  }
};
